import * as t from './types';

export function printType<T>(type: t.Type<T>): string {
  if (type instanceof t.NumberType) {
    return 'number';
  } else if (type instanceof t.BooleanType) {
    return 'boolean';
  } else if (type instanceof t.StringType) {
    return 'string';
  } else if (type instanceof t.LiteralType) {
    return JSON.stringify(type.value);
  } else if (type instanceof t.UnionType) {
    const types = type.types.map((type: any) => printType(type));
    return types.join(' | ');
  } else if (type instanceof t.InterfaceType) {
    const props = Object.entries(type.props).map(([key, value]) => {
      const typeString = printType(value);
      return `${key}: ${typeString}`;
    });
    return `{ ${props.join('; ')} }`;
  } else if (type instanceof t.ArrayType) {
    const typeString = printType(type.type);
    return `${typeString}[]`;
  }
  throw new Error('Unknown type: ' + type);
}
