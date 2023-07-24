import { extractVariables, convertTemplate } from '../src/template';

describe('extractVariables', () => {
  it('Throw if an invalid variable name is found', () => {
    const template = 'Hello {{hello}} world {{1}}';
    expect(() => extractVariables(template)).toThrow();
  });
  it('Return the variables without duplication', () => {
    const template = 'Hello {{hello}} world {{hello}}';
    expect(extractVariables(template)).toEqual(['hello']);
  });
  it('Return an empty array if no variables are found', () => {
    const template = 'Hello world';
    expect(extractVariables(template)).toEqual([]);
  });
});

describe('convertTemplate', () => {
  it('Convert the template', () => {
    const template = 'Hello {{hello}} world!';
    expect(convertTemplate(template)).toEqual("Hello 'hello' world!");
  });
});
