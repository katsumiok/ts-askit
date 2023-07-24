export {
  Type,
  NumberType,
  StringType,
  BooleanType,
  LiteralType,
  ArrayType,
  InterfaceType,
  UnionType,
  CodeType,
} from './typing';
export type { ValidType, TypeVisitor } from './typing';
export { number, string, boolean, type, array, union, literal } from './typing';

/*

const number = new Typing();
const string = new Typing();
const boolean = new Typing();

class Value<T> extends Typing {
  constructor(public value: T) {
    super();
  }
}

class Union {
  constructor(public values: Typing[]) {}
}

class ArrayType<T extends Typing> extends Typing {
  constructor(public type: T) {
    super();
  }
}

function value<T extends number | string | boolean>(value: T): Value<T> {
  return new Value<T>(value);
}

function union(...values: Typing[]): Union {
  return new Union(values);
}

function object(body: { [key: string]: Typing }) {}

function array<T extends Typing>(type: T): ArrayType<T> {
  return new ArrayType<T>(type);
}

object({
  x: number,
  y: string,
});
 */
