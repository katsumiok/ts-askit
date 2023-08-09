#!/usr/bin/env node
import { llm } from '../askit';
import { readFileSync, writeFileSync } from 'fs';
import { askCode, sendChatRequest } from '../gpt';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { checkProgram } from '../check';
import { makeModuleName } from '../transform/transformer';
import * as ts from 'typescript';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import { Info } from '../info';

const x = `Please explain the reason before answering yes or no.
Final answer should be enclosed with a bracket like [yes].
Are you good at doing the same task as the following function without implementing when all the parameters are given:
\`\`\`ts
// translate 's' into 'lang'
function llm1383(s: string, lang: string): string[];
\`\`\`
`;

const y = 'Is the answer always the same as the function?';

const examples = [
  [
    ['Math Problems', 'What is 7 times 8?'],
    ['String Manipulation', "What is the reverse of the string 'hello'?"],
    ['Algorithm Explanation', 'What is bubble sort?'],
    ['Data Structure Usage', 'How do I use a stack in Python?'],
    [
      'Sorting and Searching Algorithms',
      'What is the smallest number in the list [1, 3, 7, 0]?',
    ],
  ],
  [
    [
      'Real-time Data',
      'Fetch the current weather in New York City using the OpenWeatherMap API.',
    ],
    ['User-specific Data', 'Count the most frequent word in a text file.'],
    [
      'Database Interaction',
      'Fetch the latest order from an online store database.',
    ],
    [
      'Advanced Calculations and Algorithms',
      'Solve the traveling salesperson problem using a genetic algorithm.',
    ],
    [
      'Machine Learning Model Training and Prediction',
      'Train a linear regression model using the Scikit-learn library.',
    ],
  ],
  [
    [
      'Question Answering \\cite{Lewis_2019}',
      'Who won the Nobel Prize in Literature in 2020?',
    ],
    [
      'Text Summarization \\cite{Narayan_2018}',
      "Summarize the key points of the 'Gettysburg Address'?",
    ],
    [
      'Language Translation \\cite{Brown_2020}',
      "Translate the phrase 'Artificial Intelligence' into French.",
    ],
    [
      'Sentiment Analysis \\cite{Socher_2013}',
      'Is the sentiment in this review positive or negative?',
    ],
    [
      'Explanation of Concepts \\cite{Yih_2016}',
      'Can you explain quantum physics in simple terms?',
    ],
    [
      'Predicting Text \\cite{Srivastava_2018}',
      "Continue the story: 'Once upon a time in a land far, far away...'",
    ],
    [
      'Paraphrasing \\cite{prakash2016neural}',
      "Can you paraphrase the sentence 'The quick brown fox jumps over the lazy dog'?",
    ],
    [
      'Filling in the Blanks \\cite{Narayan_2018}',
      "Complete the sentence: 'The Eiffel Tower is located in ____.'",
    ],
  ],
];

const context2 = `
Codable and Directly Answerable Tasks[0]: These tasks are amenable to both AI responses and traditional programming implementations. They are often deterministic and rule-based, and thus, can be handled by both LLMs and coded solutions. For instance, solving mathematical problems can be achieved by following mathematical rules; manipulating strings involves application of predefined operations; regular expression matching is rule-based; and addressing sorting and searching problems involves implementing well-defined algorithms. Although these tasks can be performed by both LLMs and traditional programming, the best approach often depends on the specific context and requirements.

Codable but Not Directly Answerable Tasks[1]: These tasks are well-suited for traditional programming implementations, but AI, without access to additional resources or data, cannot directly address them. This is because these tasks often require interaction with external systems or rely on real-time or user-specific data, which LLMs don't inherently have access to. For instance, fetching real-time data from the web, working with user-specific data stored in a particular system, interacting with a database to fetch, insert, update or delete data, and resolving advanced calculations and algorithms that require specific computational resources or libraries. While LLMs can provide instructions or code for performing these tasks, executing them requires a programming environment or additional resources.

Non-Codable but Directly Answerable Tasks[2]: These tasks, often involving natural language understanding and generation, can be directly addressed by LLMs but are not amenable to a traditional programming solution. This is because they require understanding of context, semantics, and nuances of language that cannot be effectively captured by predefined algorithms or rules. Examples text summarization, which requires understanding the main points in a larger body of text; and sentiment analysis, where the AI must discern subtle emotional nuances. Other examples include language translation, explanation of abstract concepts, predicting subsequent text in a given context, and paraphrasing.
`;

const context = `
Codable and Directly Answerable Tasks[0]: These tasks are amenable to both AI responses and traditional programming implementations. 

Codable but Not Directly Answerable Tasks[1]: These tasks are well-suited for traditional programming implementations, but AI, without access to additional resources or data, cannot directly address them.

Non-Codable but Directly Answerable Tasks[2]: These tasks, often involving natural language understanding and generation, can be directly addressed by LLMs but are not amenable to a traditional programming solution.
`;

function almostEqual(
  n1: number,
  n2: number,
  epsilon: number = 0.0001
): boolean {
  return Math.abs(n1 - n2) < epsilon;
}

function deepAlmostEqual(
  obj1: any,
  obj2: any,
  epsilon: number = 0.0001
): boolean {
  // Check if both are numbers
  if (_.isNumber(obj1) && _.isNumber(obj2)) {
    return almostEqual(obj1, obj2, epsilon);
  }

  // Check if both are objects
  if (_.isObject(obj1) && _.isObject(obj2)) {
    for (let key in obj1) {
      if (
        !(key in obj2) ||
        !deepAlmostEqual((obj1 as any)[key], (obj2 as any)[key], epsilon)
      ) {
        return false;
      }
    }
    for (let key in obj2) {
      if (!(key in obj1)) {
        return false;
      }
    }
    return true;
  }

  // Else, use normal lodash isEqual
  return _.isEqual(obj1, obj2);
}

function make_message(s: string, params: [string, string][]) {
  const messages: any[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `Your job is to classify a given task into one of the following categories:
      ${context2}

      Answer should be one of the following: [0], [1], [2]
      Please provide reasoning before answering and format your final integer answer within square brackets. For example, the ideal answer can be formatted like [0]
    `,
    },
  ];

  const categories = [
    'Non-Codable but Directly Answerable Tasks',
    'Codable and Directly Answerable Tasks',
    'Codable but Not Directly Answerable Tasks',
  ];
  examples.forEach((example, i) => {
    const category = categories[i];
    example.forEach(([type, prompt]) => {
      messages.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `Classify the following task:
        
        \`\`\`
        ${prompt}
        \`\`\``,
      });
      //      messages.push({
      //        role: ChatCompletionRequestMessageRoleEnum.Assistant,
      //        content: `This is an example of ${category}: ${type} [${i}] \n`,
      //      });
    });
  });
  messages.push({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `Classify the following task:
        
    \`\`\`
    ${s}
    \`\`\`
    where
    ${params
      .map((p) => `'${p[1]}' will be replaced with a ${p[0]} value`)
      .join('\n')}
    `,
  });

  return messages;
}

async function IsCodable(taskDescription: string) {
  return !(await llm<boolean>(`
  ${context}

  Is the ${taskDescription} classified to 'Non-codable but Directly Answerable Tasks'}?
  Please answer the reason and the answer.
  `));
}

async function Generate(signature: string, taskDescription: string) {
  const func = `
    ${signature} {
        // ${taskDescription}
    }
`;
  //  return llm<string>(`Implement ${func} in TypeScript`);
  return await askCode(func);
}

async function Implement(signature: string, taskDescription: string) {
  if (await IsCodable(taskDescription)) {
    return Generate(signature, taskDescription);
  } else {
    console.log('Not codable: ', taskDescription);
  }
}

// get file name from command line
const args = process.argv.slice(2);

// check if file name is given
if (args.length !== 1) {
  console.log('Usage: askgen <filename>');
  process.exit(1);
}

function generateFiles(filename: string) {
  const text = readFileSync(filename, 'utf-8');
  const lines = text.split('\n');
  const info: Info[] = lines.map((line: string) => JSON.parse(line));
  const sourceFileName = path.basename(filename, '.jsonl');
  const dirName = path.dirname(path.dirname(filename));
  const sourceFilePath = path.join(dirName, sourceFileName);
  // generate source code
  const modules = new Set<string>();
  info.forEach(async (i: Info) => {
    const start = process.hrtime.bigint();
    const { modulePath } = makeModuleName(sourceFilePath, i.name);
    modules.add(i.name);
    if (fs.existsSync(modulePath)) {
      console.log(modulePath, ' already exists');
      return;
    }
    const dirPath = path.dirname(modulePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    let testFailedCount = 0;
    for (let count = 0; count < 10; count++) {
      const s = await sendChatRequest(make_message(i.desc, i.params));
      const m = s.match(/\[([0-9])\]/);

      if (m && !s.includes('[2]')) {
        const s = await Generate(i.signature, i.desc);
        const code = extract_ts(s);
        if (code.length === 0) {
          continue;
        }
        const diag = checkProgram(code);
        if (diag.length === 0) {
          const configPath = path.join(process.cwd(), 'tsconfig.json');
          const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
          const parseConfigHost: ts.ParseConfigHost = {
            useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
            readDirectory: ts.sys.readDirectory,
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
          };
          const parsed = ts.parseJsonConfigFileContent(
            readResult.config,
            parseConfigHost,
            path.dirname(configPath)
          );

          const output = ts.transpileModule(code, {
            compilerOptions: parsed.options,
          });
          if (!output.diagnostics || output.diagnostics.length !== 0) {
            output.diagnostics?.forEach((d) => console.log(d));
            continue;
          }
          const jsCode = output.outputText;
          // console.log('ts code: ', code);
          // console.log('js code: ', jsCode);
          const generatedFunc = getFunction(jsCode, i.name);
          if (!generatedFunc) {
            continue;
          }
          let ok = testFunction(generatedFunc, i);
          if (ok) {
            const program = `// Recompilation count: ${testFailedCount}}\n${code}`;
            writeFileSync(modulePath, program);
            const end = process.hrtime.bigint();
            const elapsed = Number(end - start) / 1000000000;
            console.log('Generated: ', modulePath, count + 1);
            writeFileSync(
              filename + '.log',
              JSON.stringify({
                name: i.name,
                elapsed,
                count,
              })
            );
            break;
          } else {
            testFailedCount++;
          }
        } else {
          console.log(diag);
          continue;
        }
      }
    }
  });

  // delete unused files
  const baseName = path.basename(filename, '.ts.jsonl');
  const jsonlDir = path.dirname(filename);
  // const moduleDir = path.join(jsonlDir, baseName);
  // const files = fs.readdirSync(moduleDir);
  // files.forEach((file) => {
  //   const moduleName = path.basename(file, '.ts');
  //   if (!modules.has(moduleName)) {
  //     console.log('Delete: ', moduleName);
  //     const filePath = path.join(moduleDir, file);
  //     fs.unlinkSync(filePath);
  //   }
  // });
}

function getFunction(jsCode: string, functionName: string) {
  try {
    const generatedFunc = eval(jsCode);
    if (generatedFunc.name !== functionName) {
      return false;
    }
    return generatedFunc;
  } catch (e) {
    return false;
  }
}

function testFunction(generatedFunc: any, i: Info) {
  let ok = true;
  try {
    i.examples.forEach(({ input, output }) => {
      const args = i.params.map(([_, name]) => input[name]);
      const actualOutput = generatedFunc(...args);
      if (
        !_.isEqual(actualOutput, output) &&
        !almostEqual(actualOutput, output) // XXX: for float
      ) {
        console.log('Failed: ', input, output, actualOutput, i.desc);
        console.log(JSON.stringify(args));
        ok = false;
      }
    });
  } catch (e) {
    ok = false;
  }
  return ok;
}

function extract_ts(s: string): string {
  // extract ts code enclosed by ```ts and ```
  const m = s.match(/```ts\n([\s\S]*?)```/);
  if (m) {
    return m[1];
  }
  return '';
}

function main() {
  const filename = args[0];

  // check if file exists
  if (!fs.existsSync(filename)) {
    console.log('File not found: ', filename);
    process.exit(1);
  }

  generateFiles(filename);
}

main();
