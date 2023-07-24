import { printType } from '../src/type-printer';
import * as t from '../src/types';

describe('generateSchema', () => {
  it('should generate a schema for a number', () => {
    expect(printType(t.number)).toEqual('number');
  });
  it('should generate a schema for a boolean', () => {
    expect(printType(t.boolean)).toEqual('boolean');
  });
  it('should generate a schema for a string', () => {
    expect(printType(t.string)).toEqual('string');
  });
  it('should generate a schema for a literal', () => {
    expect(printType(t.literal('hello'))).toEqual('"hello"');
  });
  it('should generate a schema for a union', () => {
    expect(printType(t.union([t.number, t.string]))).toEqual('number | string');
  });

  it('should generate a schema for an interface', () => {
    expect(
      printType(
        t.type({
          x: t.number,
          y: t.string,
        })
      )
    ).toEqual('{ x: number; y: string }');
  });
  it('should generate a schema for an array', () => {
    expect(printType(t.array(t.number))).toEqual('number[]');
  });
  it('should throw an error for an unknown type', () => {
    expect(() => printType({} as any)).toThrow();
  });
});
