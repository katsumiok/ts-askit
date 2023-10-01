export type ValidType =
  | Type<number>
  | Type<string>
  | Type<boolean>
  | CodeType
  | ArrayType<ValidType>
  | UnionType<ValidType>
  | InterfaceType<ValidType>
  | RecordType<ValidType>
  | TupleType<ValidType>;

// all valid languages usable in code blocks in
export type LanguageType =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'json'
  | 'html'
  | 'css'
  | 'markdown'
  | 'bash'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'java'
  | 'kotlin'
  | 'php'
  | 'ruby'
  | 'rust'
  | 'sql'
  | 'swift'
  | string;

export type TypeOf<T> = T;

export interface TypeVisitor<ReturnType, ArgsType extends Array<unknown>> {
  visitNumberType(type: NumberType, ...args: ArgsType): ReturnType;
  visitStringType(type: StringType, ...args: ArgsType): ReturnType;
  visitBooleanType(type: BooleanType, ...args: ArgsType): ReturnType;
  visitCodeType(type: CodeType, ...args: ArgsType): ReturnType;
  visitArrayType(type: ArrayType<ValidType>, ...args: ArgsType): ReturnType;
  visitUnionType(type: UnionType<ValidType>, ...args: ArgsType): ReturnType;
  visitInterfaceType(
    type: InterfaceType<ValidType>,
    ...args: ArgsType
  ): ReturnType;
  visitLiteralType(type: LiteralType<unknown>, ...args: ArgsType): ReturnType;
  visitRecordType(type: RecordType<ValidType>, ...args: ArgsType): ReturnType;
  visitTupleType(type: TupleType<ValidType>, ...args: ArgsType): ReturnType;
}

export class Type<T> {
  accept<ReturnType, ArgsType extends Array<unknown>>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    throw new Error('Not implemented');
  }
}

export class NumberType extends Type<number> {
  constructor(
    public min?: number,
    public max?: number
  ) {
    super();
  }
  override accept<ReturnType, ArgsType extends Array<unknown>>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitNumberType(this, ...args);
  }
  range(min: number, max: number): NumberType {
    return new NumberType(min, max);
  }
}

export class StringType extends Type<string> {
  constructor(
    public pattern?: RegExp,
    public minLength?: number,
    public maxLength?: number
  ) {
    super();
  }
  override accept<ReturnType, ArgsType extends Array<unknown>>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitStringType(this, ...args);
  }
  match(pattern: RegExp): StringType {
    return new StringType(pattern, this.minLength, this.maxLength);
  }
  length(min: number, max: number): StringType {
    return new StringType(this.pattern, min, max);
  }
}

export class BooleanType extends Type<boolean> {
  constructor() {
    super();
  }
  override accept<ReturnType, ArgsType extends Array<unknown>>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitBooleanType(this, ...args);
  }
}

export const number = new NumberType();
export const string = new StringType();
export const boolean = new BooleanType();

export class CodeType extends Type<string> {
  constructor(public language: string) {
    super();
  }
  override accept<ReturnType, ArgsType extends Array<unknown>>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitCodeType(this, ...args);
  }
}

export class ArrayType<T> extends Type<T[]> {
  constructor(public type: Type<T>) {
    super();
  }
  override accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitArrayType(this, ...args);
  }
}

export class UnionType<T> extends Type<T> {
  constructor(public types: Type<T>[]) {
    super();
  }
  accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitUnionType(this, ...args);
  }
}

export class InterfaceType<T> extends Type<T> {
  constructor(public props: { [key: string]: Type<ValidType> }) {
    super();
  }
  override accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitInterfaceType(this, ...args);
  }
}

export class LiteralType<T> extends Type<T> {
  constructor(public value: T) {
    super();
  }
  override accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitLiteralType(this, ...args);
  }
}

export class RecordType<T> extends Type<T> {
  constructor(
    public keyType: Type<T>,
    public valueType: Type<T>
  ) {
    super();
  }
  override accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitRecordType(this, ...args);
  }
}

export class TupleType<T> extends Type<T> {
  constructor(public types: Type<T>[]) {
    super();
  }
  override accept<ReturnType, ArgsType extends unknown[]>(
    visitor: TypeVisitor<ReturnType, ArgsType>,
    ...args: ArgsType
  ): ReturnType {
    return visitor.visitTupleType(this, ...args);
  }
}

export function type<T>(dic: { [key: string]: Type<ValidType> }): Type<T> {
  return new InterfaceType(dic);
}

export function union<T>(types: Type<T>[]): Type<T> {
  return new UnionType(types);
}

export function array<T>(type: Type<T>): Type<T[]> {
  return new ArrayType(type);
}

export function literal<T>(value: T): Type<T> {
  return new LiteralType(value);
}

export function record<T>(keyType: Type<T>, valueType: Type<T>): Type<T> {
  return new RecordType(keyType, valueType);
}

export function tuple<T>(types: Type<T>[]): Type<T> {
  return new TupleType(types);
}
