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
import { ExamplesType } from '../example';

function almostEqual(
  n1: number,
  n2: number,
  epsilon: number = 0.0001
): boolean {
  return Math.abs(n1 - n2) < epsilon;
}

async function Generate(
  signature: string,
  taskDescription: string,
  functionName: string,
  trainingExamples: ExamplesType
) {
  const func = `${signature} {
        // ${taskDescription}
    }
`;
  //  return llm<string>(`Implement ${func} in TypeScript`);
  return await askCode(func, functionName, trainingExamples);
}

// get file name from command line
const args = process.argv.slice(2);

// check if file name is given
if (args.length !== 1) {
  console.log('Usage: askgen <filename>');
  process.exit(1);
}

async function generateFiles(filename: string) {
  const text = readFileSync(filename, 'utf-8');
  const lines = text.split('\n');
  const info: Info[] = lines.map((line: string) => JSON.parse(line));
  const sourceFileName = path.basename(filename, '.jsonl');
  const dirName = path.dirname(path.dirname(filename));
  const sourceFilePath = path.join(dirName, sourceFileName);
  // generate source code
  const modules = new Set<string>();
  for (const i of info) {
    const start = process.hrtime.bigint();
    const { modulePath } = makeModuleName(sourceFilePath, i.name);
    modules.add(i.name);
    if (fs.existsSync(modulePath)) {
      console.log(modulePath, ' already exists');
      continue;
    }
    const dirPath = path.dirname(modulePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    let testFailedCount = 0;
    for (let count = 0; count < 10; count++) {
      const s = await Generate(i.signature, i.desc, i.name, i.trainingExamples);
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
        let ok = await testFunction(generatedFunc, i);
        if (ok) {
          const program = `// Recompilation count: ${testFailedCount}\n${code}`;
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

function executeWithTimeout(
  func: any,
  args: any[],
  timeout: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout'));
    }, timeout);
    try {
      const result = func(...args);
      clearTimeout(timer);
      resolve(result);
    } catch (e) {
      clearTimeout(timer);
      reject(e);
    }
  });
}

async function testFunction(generatedFunc: any, i: Info) {
  let ok = true;
  try {
    for (const example of i.testExamples) {
      const args = i.params.map(([_, name]) => example.input[name]);
      const isDefinedFunction = i.params.length === 0;
      let actualOutput = isDefinedFunction
        ? await executeWithTimeout(generatedFunc, [example.input], 60000)
        : await executeWithTimeout(generatedFunc, args, 60000);

      //const actualOutput =
      if (
        !_.isEqual(actualOutput, example.output) &&
        !almostEqual(actualOutput, example.output) // XXX: for float
      ) {
        console.log(
          'Failed: ',
          example.input,
          example.output,
          actualOutput,
          i.desc
        );
        console.log(JSON.stringify(args));
        ok = false;
      }
    }
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
