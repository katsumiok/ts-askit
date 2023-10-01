import { over, union } from 'lodash';
import * as t from './typing';

export const validator = t.type({
  x: t.number,
  y: t.string,
});

export type Validator = t.TypeOf<typeof validator>;

class TypeValidator implements t.TypeVisitor<boolean, [any]> {
  visitArrayType(type: t.ArrayType<t.ValidType>, data: any): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Expected array');
    }
    for (const item of data) {
      type.type.accept(this, item);
    }
    return true;
  }
  visitBooleanType(type: t.Type<boolean>, data: any): boolean {
    if (typeof data !== 'boolean') {
      throw new Error('Expected boolean');
    }
    return true;
  }
  visitCodeType(type: t.CodeType, data: any): boolean {
    return true;
  }
  visitNumberType(type: t.NumberType, data: any): boolean {
    // check if data is a number
    if (typeof data !== 'number') {
      throw new Error('Expected number');
    }
    // check if data is within the range
    if (type.min !== undefined && data < type.min) {
      throw new Error(`Expected number to be greater than ${type.min}`);
    }
    if (type.max !== undefined && data > type.max) {
      throw new Error(`Expected number to be less than ${type.max}`);
    }
    return true;
  }
  visitInterfaceType(type: t.InterfaceType<t.ValidType>, data: any): boolean {
    if (typeof data !== 'object') {
      throw new Error('Expected object');
    }
    for (const key in type.props) {
      if (key in data) {
        type.props[key].accept(this, data[key]);
      } else {
        throw new Error(`Expected object to have property ${key}`);
      }
    }
    return true;
  }
  visitStringType(type: t.StringType, data: any): boolean {
    if (typeof data !== 'string') {
      throw new Error('Expected string');
    }
    if (type.pattern !== undefined && !type.pattern.test(data)) {
      throw new Error(`Expected string to match ${type.pattern}`);
    }
    if (type.minLength !== undefined && data.length < type.minLength) {
      throw new Error(`Expected string to be longer than ${type.minLength}`);
    }
    if (type.maxLength !== undefined && data.length > type.maxLength) {
      throw new Error(`Expected string to be shorter than ${type.maxLength}`);
    }
    return true;
  }
  visitUnionType(type: t.UnionType<t.ValidType>, data: any): boolean {
    for (const option of type.types) {
      try {
        if (option.accept(this, data)) {
          return true;
        }
      } catch (e) {}
    }
    throw new Error('Expected union to match one of its options');
  }
  visitLiteralType(type: t.LiteralType<unknown>, data: any): boolean {
    if (type.value === data) {
      return true;
    }
    throw new Error(`Expected literal to be ${type.value}`);
  }
  visitRecordType(type: t.RecordType<t.ValidType>, data: any): boolean {
    if (typeof data !== 'object') {
      throw new Error('Expected object');
    }
    for (const key in data) {
      if (!type.keyType.accept(this, key)) {
        throw new Error(`Expected key to be ${type.keyType}`);
      }
      if (!type.valueType.accept(this, data[key])) {
        throw new Error(`Expected value to be ${type.valueType}`);
      }
    }
    return true;
  }
  visitTupleType(type: t.TupleType<t.ValidType>, data: any): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Expected array');
    }
    if (type.types.length != data.length) {
      throw new Error('The length of the tuple is not correct');
    }
    for (let i = 0; i < type.types.length; i++) {
      type.types[i].accept(this, data[i]);
    }
    return true;
  }
}

export function validate(type: t.Type<any>, data: any): boolean {
  const validator = new TypeValidator();
  type.accept(validator, data);
  return true;
}
