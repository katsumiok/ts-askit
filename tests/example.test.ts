import { ExamplesType, checkExamples } from '../src/example';
import * as t from '../src/types';

describe('checkExamples', () => {
  it('Throw if the examples is not an array', () => {
    const examples = 1;
    expect(() => checkExamples(t.number, ['x'], examples as any)).toThrow();
  });
  it('Throw if the example is not an object', () => {
    const examples = [1];
    expect(() => checkExamples(t.number, ['x'], examples as any)).toThrow();
  });
  it('Throw if input is not contained', () => {
    const examples = [{ output: 1 }];
    expect(() =>
      checkExamples(t.number, ['x'], examples as ExamplesType)
    ).toThrow();
  });
  it('Throw if output is not contained', () => {
    const examples = [{ input: { x: 1 } }];
    expect(() => checkExamples(t.number, ['x'], examples as any)).toThrow();
  });
  it('Throw if the input is not a object', () => {
    const examples = [{ input: 1 as any, output: 1 }];
    expect(() => checkExamples(t.number, ['x'], examples)).toThrow();
  });
  it('Throw if a parameter is not contained', () => {
    const examples = [{ input: ['y'], output: 1 }];
    expect(() => checkExamples(t.number, ['x'], examples)).toThrow();
  });
  it('An unknown parameter is contained', () => {
    const examples = [{ input: { x: 1, y: 1 }, output: 1 }];
    expect(() => checkExamples(t.number, ['x'], examples)).toThrow();
  });
  it('The output has an invalid type.', () => {
    const examples = [{ input: { x: 1 }, output: 'a' }];
    expect(() => checkExamples(t.number, ['x'], examples)).toThrow();
  });
  it('The output has a valid type.', () => {
    const examples = [{ input: { x: 1 }, output: 1 }];
    expect(() => checkExamples(t.number, ['x'], examples)).not.toThrow();
  });
});
