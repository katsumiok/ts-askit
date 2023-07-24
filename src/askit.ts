import { Agent } from 'http';
import { ExamplesType } from './example';
import { define } from './function';
import * as t from './types';

export async function llm<T = any>(
  template: string,
  examples: ExamplesType = []
): Promise<T> {
  return ask<T>(template, examples);
}

export async function ask<T = any>(
  template: string,
  examples?: ExamplesType
): Promise<T>;
export async function ask<T>(
  type: t.Type<T>,
  template: string,
  examples?: ExamplesType,
  args?: { [key: string]: any }
): Promise<T>;
export async function ask<T = any>(...args: unknown[]): Promise<T> {
  let type: t.Type<T>;
  let template: string;
  let examples: ExamplesType;

  if (typeof args[0] === 'string') {
    throw new Error('Transpilation with AskIt is needed!');
  } else if (args[0] instanceof t.Type) {
    type = args[0] as t.Type<T>;
    template = args[1] as string;
    examples = args[2] as ExamplesType;
    const argsMap = args[3] as { [key: string]: any };
    const f = define(type, template, examples);
    const result = f(argsMap);
    return result;
  }
  throw new Error('Invalid number of arguments');
}

//const sort = define(t.array(t.number), 'sort numbers {{x}} in ascending order');
//sort.call({ x: [1, -2, 3] }).then((x) => console.log(x));
//sort.call({ x: [1, -2, 3] }).then((x) => console.log(x));
