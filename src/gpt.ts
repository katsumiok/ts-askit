import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';

import * as t from './types';
import { ExamplesType } from './example';
import { printType } from './type-printer';
import { validate } from './types/validator';
import { getConfig, subscribe } from './config';

const x = t.type({ x: t.number });

let api = createApi();
subscribe((_) => {
  api = createApi();
});

function createApi() {
  const openaiConfig = new Configuration({
    apiKey: getConfig().openai_apiKey,
  });
  return new OpenAIApi(openaiConfig);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function chatWithRetry(
  model: string,
  messages: any[],
  maxRetries: number = 10
): Promise<any> {
  const baseWaitTime = 1000;
  const request: CreateChatCompletionRequest = {
    messages: messages,
    model: model,
  };
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await api.createChatCompletion(request);
      return response;
    } catch (error: any) {
      if (error instanceof Object) {
        // console.log(error.response.status);
        error = error as any;
        if (![429, 500, 503].includes(error.response.status)) {
          throw error;
        }
      }
      const waitTime = baseWaitTime * Math.pow(2, i);
      const jitter = waitTime / 2;
      const randomJitter = Math.floor(Math.random() * jitter * 2) - jitter;
      await sleep(waitTime + randomJitter);
    }
  }
  throw new Error(`Failed to get response after ${maxRetries} attempts`);
}

function makeQA(task: string, example: any): [string, string] {
  const question = task + '\n';
  const input = example['input'];
  const output = example['output'];
  const q = makeQuestion(task, input);
  const a = makeAnswer(output);
  return [q, a];
}

function makeExampleChatMessages(task: string, examples: ExamplesType) {
  const messages: ChatCompletionRequestMessage[] = [];
  examples.forEach((example) => {
    const [q, a] = makeQA(task, example);
    messages.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: q,
    });
    messages.push({
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: a,
    });
  });
  return messages;
}

function makeMessages<T>(
  task: string,
  varMap: { [key: string]: any },
  returnType: t.Type<T>,
  trainingExamples: ExamplesType
): ChatCompletionRequestMessage[] {
  const typeString = printType(returnType);
  const system = makeSystemMessage(typeString);
  const question = makeQuestion(task, varMap);
  const exampleMessages = makeExampleChatMessages(task, trainingExamples);
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: system,
    },
    ...exampleMessages,
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: question + '\n',
    },
  ];
  // console.log(messages.map((message) => message.content).join('\n'));
  return messages;
}

function askString(
  question: string,
  type: string
): Array<ChatCompletionRequestMessage> {
  const system = makeSystemMessage(type);
  return [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: system,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: question + '\n',
    },
  ];
}

function makeSystemMessage(type: string) {
  let message = `You are a helpful assistant that generates responses in JSON format enclosed with \`\`\`json and \`\`\` like:
\`\`\`json
{ "reason": "Step-by-step reason for the answer", "answer": "Final answer or result" }
\`\`\`

The response in the JSON code block should be given in the type defined as follows:
\`\`\`ts
{ reason: string; answer: ${type} }
\`\`\`
Explain your answer step-by-step in the 'reason' field.`;
  if (type === 'string') {
    message +=
      "\nNo additional text should be part of the value in the 'answer' field.";
  }
  return message;
}

function askCoding(question: string): Array<ChatCompletionRequestMessage> {
  return [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "You are a TypeScript programmer. Your task is to implement the body of the function in strict mode, following TypeScript's strict typing rules.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `
      \`\`\`ts
      function add(a: number, b: number): number {
        // add 'a' and 'b'
      }
      \`\`\`
      `,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: `
      \`\`\`ts
      function add(a: number, b: number): number {
        // add 'a' and 'b'
        return a + b;
      }
      \`\`\`
      `,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `
      \`\`\`ts
      ${question}
      \`\`\`
      `,
    },
  ];
}

export async function sendChatRequest(
  messages: ChatCompletionRequestMessage[]
): Promise<string> {
  const result = await chatWithRetry('gpt-3.5-turbo-16k', messages);
  //console.log(JSON.stringify(result.data));
  //console.log('-----');
  return result.data.choices[0].message.content;
}

export async function ask(message: string, typeString: string) {
  return await sendChatRequest(askString(message, typeString));
}

export function extractJson(result: string): any | null {
  const m = /[\s\S]*?```json\n([\s\S]*?)\n```[\s\S]*/gm.exec(result);
  const jsonText = m ? m[1] : result;
  try {
    const data = JSON.parse(jsonText);
    return data;
  } catch (error) {
    // console.log('failed to parse as JSON: ', jsonText);
    // console.log('error: ', error);
    return null;
  }
}

function makeRetryMessage(returnType: t.Type<any>): string {
  const type = printType(returnType);
  return `Generates responses again in JSON format enclosed with \`\`\`json and \`\`\` like:
\`\`\`json
{ "reason": "Reason for the answer", "answer": "Final answer or result" }
\`\`\`
The response in the JSON code block should be given in the type defined as follows:
\`\`\`ts
{ reason: string; answer: ${type} }
\`\`\`
`;
}

async function askAndParse<T>(
  returnType: t.Type<T>,
  messages: ChatCompletionRequestMessage[]
): Promise<[T, string, string[], any]> {
  let retry = false;
  const errors: string[] = [];
  for (let i = 0; i < 10; i++) {
    // console.log(messages);
    const completion = await chatWithRetry('gpt-3.5-turbo-16k', messages);
    const content = completion.data.choices[0].message.content;
    try {
      const [data, reason] = parse(content, returnType);
      return [data, reason, errors, completion];
    } catch (error: any) {
      errors.push(error.message);
      if (retry) {
        // Remove the last two element from the messages
        messages.splice(-2);
        retry = false;
      } else {
        const s = makeRetryMessage(returnType);
        messages.push({
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: content,
        });
        messages.push({
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: s,
        });
        retry = true;
      }
      // console.log('failed to parse as JSON: ', result);
      // console.log('error: ', error);
      // console.log('retrying...');
    }
  }
  throw new Error('Failed to parse JSON after multiple attempts');
}

export async function chat<T>(
  task: string,
  varMap: { [key: string]: any },
  returnType: t.Type<T>,
  trainingExamples: ExamplesType
): Promise<[T, string, string[], any]> {
  const messages = makeMessages(task, varMap, returnType, trainingExamples);
  return askAndParse(returnType, messages);
}

function parse<T>(text: string, returnType: t.Type<T>): [T, string] | never {
  const data = extractJson(text);
  if (data === null) {
    throw new Error('Answer is not in a JSON block');
  }
  if (!(data instanceof Object)) {
    throw new Error('JSON must be an object');
  }
  if (!('answer' in data)) {
    throw new Error('JSON must contain "answer" field');
  }
  const value = data['answer'];
  if (!validate(returnType, value)) {
    throw new Error(`Output must be of type ${printType(returnType)}`);
  }
  return [value, 'reason' in data ? data['reason'] : ''];
}

export async function askCode(message: string): Promise<any> {
  const s = await sendChatRequest(askCoding(message));
  //console.log(s);
  return s;
}

function makeQuestion(task: string, varMap: { [key: string]: any }): string {
  const question = task + '\n';
  if (Object.keys(varMap).length === 0) {
    return question;
  }
  const varList = Object.entries(varMap).map(
    ([key, value]) => `  '${key}' = ${JSON.stringify(value)}`
  );
  return question + '\n where\n' + varList.join('\n');
}

function makeAnswer(answer: any): string {
  return `\`\`\`json
{
    "reason": "...", 
    "answer": ${JSON.stringify(answer)}
}
\`\`\``;
}
