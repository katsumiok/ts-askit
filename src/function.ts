import { ExamplesType, checkExamples } from './example';
import { generateUniqueFunctionName } from './function-name';
import { chat } from './gpt';
import { convertTemplate, extractVariables } from './template';
import * as t from './types';

export class Function<T> {
  public rawResponse: string = '';
  public variables: string[];

  constructor(
    private returnType: t.Type<T>,
    private template: string,
    private trainingExamples: ExamplesType
  ) {
    if (!(returnType instanceof t.Type)) {
      throw new Error('Invalid return type');
    }
    this.variables = extractVariables(template);
    checkExamples(returnType, this.variables, trainingExamples);
  }

  checkArgs(args: { [key: string]: any }): void | never {
    if (!(args instanceof Object)) {
      throw new Error('Args must be an object');
    }
    this.variables.forEach((variable) => {
      if (!(variable in args)) {
        throw new Error(`Args must contain '${variable}' field`);
      }
    });
    Object.entries(args).forEach(([variable, value]) => {
      if (!this.variables.includes(variable)) {
        throw new Error(`Unknown variable '${variable}'`);
      }
    });
  }

  async call(args: { [key: string]: any } = {}) {
    this.checkArgs(args);
    const convertedTemplate = convertTemplate(this.template);
    return chat(
      convertedTemplate,
      args,
      this.returnType,
      this.trainingExamples
    );
  }

  compile(testExamples: ExamplesType = []) {
    checkExamples(this.returnType, this.variables, testExamples);
    const task = convertTemplate(this.template);
    const functionName = generateUniqueFunctionName(task);
  }
}

type DefinedFunctionType<T, U> = {
  (args: U): Promise<T>;
  reason: string;
  errors: string[];
  completion: any;
};

export function define<
  T,
  U extends Record<string, any> = { [key: string]: any },
>(
  type: t.Type<T>,
  template: string,
  trainingExamples?: ExamplesType,
  testExamples?: ExamplesType
): DefinedFunctionType<T, U>;
export function define<
  T,
  U extends Record<string, any> = { [key: string]: any },
>(
  template: string,
  trainingExamples?: ExamplesType,
  testExamples?: ExamplesType
): DefinedFunctionType<T, U>;
export function define<
  T,
  U extends { [key: string]: any } = { [key: string]: any },
>(...args: unknown[]): DefinedFunctionType<T, U> {
  if (typeof args[0] != 'string') {
    const type = args[0] as t.Type<T>;
    const template = args[1] as string;
    const trainingExamples = (args[2] as ExamplesType) || [];
    const f = new Function(type, template, trainingExamples);
    const g = async function (args: U = {} as U) {
      // XXX: as U needed?
      const [answer, reason, errors, completion] = await f.call(args);
      g.reason = reason;
      g.errors = errors;
      g.completion = completion;
      return answer;
    } as DefinedFunctionType<T, U>;
    return g;
  }
  throw new Error('defined should be transpiled by AskIt');
}
