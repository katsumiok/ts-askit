import * as t from './types';
import { validate } from './types/validator';
import { printType } from './type-printer';

export type ExampleType = { input: { [key: string]: any }; output: any };
export type ExamplesType = ExampleType[];

export function checkExamples<T>(
  return_type: t.Type<T>,
  variables: string[],
  examples: ExamplesType
): never | void {
  if (!(examples instanceof Array)) {
    throw new Error('Examples must be an array');
  }
  examples.forEach((example) => checkExample(return_type, variables, example));
}

function checkExample<T>(
  return_type: t.Type<T>,
  variables: string[],
  example: ExampleType
) {
  if (!(example instanceof Object)) {
    throw new Error('Example must be an object');
  }
  if (!('input' in example)) {
    throw new Error("Example must contain 'input' field");
  }
  if (!('output' in example)) {
    throw new Error("Example must contain 'output' field");
  }
  const input = example['input'];
  checkInput(variables, input);
  const output = example['output'];
  checkOutput(return_type, output);
}

function checkInput(variables: string[], input: { [key: string]: any }) {
  if (!(input instanceof Object)) {
    throw new Error('Input must be an object');
  }
  for (const variable of variables) {
    if (!(variable in input)) {
      throw new Error(`Input must contain '${variable}' field`);
    }
  }
  for (const [variable, value] of Object.entries(input)) {
    if (!variables.includes(variable)) {
      throw new Error(`Unknown variable '${variable}'`);
    }
  }
}

function checkOutput<T>(returnType: t.Type<T>, output: any) {
  if (!validate(returnType, output)) {
    throw new Error(`Output must be of type ${printType(returnType)}`);
  }
}
