import { ExamplesType } from './example';
import { define } from './function';
import * as t from './types';

let fReason = '';
let fErrors: string[] = [];
let fCompletion: any = { data: null };

export function getReason(): string {
  return fReason;
}
export function getErrors(): string[] {
  return fErrors;
}
export function getCompletion(): any {
  return fCompletion;
}

export async function llm<T = any>(
  template: string,
  trainingExamples: ExamplesType = [],
  testExamples: ExamplesType = []
): Promise<T> {
  return ask<T>(template, testExamples, trainingExamples);
}

export async function ask<T = any>(
  template: string,
  trainingExamplesExamples?: ExamplesType,
  testExamples?: ExamplesType
): Promise<T>;
export async function ask<T>(
  type: t.Type<T>,
  template: string,
  trainingExamplesExamples?: ExamplesType,
  testExamples?: ExamplesType,
  args?: { [key: string]: any }
): Promise<T>;
export async function ask<T = any>(...args: unknown[]): Promise<T> {
  let type: t.Type<T>;
  let template: string;
  let trainingExamples: ExamplesType;
  let testExamples: ExamplesType;

  if (typeof args[0] === 'string') {
    throw new Error('Transpilation with AskIt is needed!');
  } else if (args[0] instanceof t.Type) {
    type = args[0] as t.Type<T>;
    template = args[1] as string;
    trainingExamples = args[2] as ExamplesType;
    testExamples = args[3] as ExamplesType;
    const argsMap = args[3] as { [key: string]: any };
    const f = define(type, template, trainingExamples, testExamples);
    const result = await f(argsMap);
    fReason = f.reason;
    fErrors = f.errors;
    fCompletion = f.completion;

    return result;
  }
  throw new Error('Invalid number of arguments');
}

//const sort = define(t.array(t.number), 'sort numbers {{x}} in ascending order');
//sort.call({ x: [1, -2, 3] }).then((x) => console.log(x));
//sort.call({ x: [1, -2, 3] }).then((x) => console.log(x));
