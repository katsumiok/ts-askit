import ts from 'typescript';
import { throwError } from './common';

export class TypeConverter {
  TypeConverter() {}

  printBrackets(s: string): string {
    return `{ ${s} }`;
  }

  printArray(s: string): string {
    return `${s}[]`;
  }

  printNumber(): string {
    return 'number';
  }

  printString(): string {
    return 'string';
  }

  printBoolean(): string {
    return 'boolean';
  }

  printObject(): string {
    return 'object';
  }

  printStringLiteral(exp: ts.LiteralExpression): string {
    return exp.getText();
  }

  printTypeElements(typeElements: string[]) {
    return typeElements.join('; ');
  }

  printUnion(types: string[]): string {
    return types.join(' | ');
  }

  printNumericLiteral(exp: ts.LiteralExpression): string {
    return exp.getText();
  }

  handleTypeElement(typeElement: ts.TypeElement, checker: ts.TypeChecker) {
    if (ts.isPropertySignature(typeElement)) {
      const name = typeElement.name.getText();
      const type = typeElement.type;
      if (type) {
        const direction = this.makeTypeDirection(type, checker);
        return `${name}: ${direction}`;
      }
    }
    console.log('handleTypeElement: not implemented', typeElement);
    return '';
  }

  // XXX: This function is not fully implemented.
  makeTypeDirection(type: ts.TypeNode, checker: ts.TypeChecker): string {
    if (ts.isArrayTypeNode(type)) {
      const t = type.elementType;
      return this.printArray(this.makeTypeDirection(t, checker));
    } else if (ts.isTypeReferenceNode(type)) {
      const t = type.typeName;
      const symbol = checker.getSymbolAtLocation(t);
      if (symbol) {
        let result = '';
        symbol.declarations?.forEach((decl) => {
          if (ts.isTypeAliasDeclaration(decl)) {
            const type = decl.type;
            result = this.makeTypeDirection(type, checker);
          } else if (ts.isInterfaceDeclaration(decl)) {
            const members = this.printTypeElements(
              decl.members.map((member) =>
                this.handleTypeElement(member, checker)
              )
            );
            result = this.printBrackets(members);
          }
        });
        if (result === '') {
          throw new Error('not implemented: ' + type.getText());
        }
        return result;
      }
    } else if (ts.isTypeLiteralNode(type)) {
      const members = this.printTypeElements(
        type.members.map((member) => this.handleTypeElement(member, checker))
      );
      return this.printBrackets(members);
    } else if (type.getText() === 'number') {
      return this.printNumber();
    } else if (type.getText() === 'string') {
      return this.printString();
    } else if (type.getText() === 'boolean') {
      return this.printBoolean();
    } else if (type.getText() === 'object') {
      return this.printObject();
    } else if (ts.isUnionTypeNode(type)) {
      return this.printUnion(
        type.types.map((t) => this.makeTypeDirection(t, checker))
      );
    } else if (ts.isLiteralTypeNode(type)) {
      if (ts.isStringLiteral(type.literal)) {
        return this.printStringLiteral(type.literal);
      } else if (ts.isNumericLiteral(type.literal)) {
        return this.printNumericLiteral(type.literal);
      }
    }
    throw throwError(type, 'Not implemented type: ');
  }
}

export class IoTypeChecker extends TypeConverter {
  printBrackets(s: string): string {
    return `t.type({ ${s} })`;
  }

  override printArray(s: string): string {
    return `t.array(${s})`;
  }

  override printNumber(): string {
    return 't.number';
  }

  override printString(): string {
    return 't.string';
  }

  override printBoolean(): string {
    return 't.boolean';
  }

  override printObject(): string {
    return 't.object';
  }

  override printTypeElements(typeElements: string[]) {
    return typeElements.join(', ');
  }

  override printUnion(types: string[]): string {
    return `t.union([${types.join(', ')}])`;
  }
  override printStringLiteral(exp: ts.LiteralExpression): string {
    return `t.literal(${exp.getText()})`;
  }
  override printNumericLiteral(exp: ts.LiteralExpression): string {
    return `t.literal(${exp.getText()})`;
  }
}

export class JsTypeGenerator extends TypeConverter {
  printBrackets(s: string): string {
    return `__type__({ ${s} })`;
  }

  override printArray(s: string): string {
    return `__array__(${s})`;
  }

  override printNumber(): string {
    return '__number__';
  }

  override printString(): string {
    return '__string__';
  }

  override printBoolean(): string {
    return '__boolean__';
  }

  override printObject(): string {
    return '__object__';
  }

  override printTypeElements(typeElements: string[]) {
    return typeElements.join(', ');
  }

  override printUnion(types: string[]): string {
    console.log(types);
    return `__union__([${types.join(', ')}])`;
  }
  override printStringLiteral(exp: ts.LiteralExpression): string {
    console.log(exp.text, exp.getText());
    return `__literal__(${exp.getText()})`;
  }
  override printNumericLiteral(exp: ts.LiteralExpression): string {
    return `__literal__(${exp.getText()})`;
  }
}

function handleTypeElement(
  typeElement: ts.TypeElement,
  checker: ts.TypeChecker
) {
  if (ts.isPropertySignature(typeElement)) {
    const name = typeElement.name.getText();
    const type = typeElement.type;
    if (type) {
      const direction = convertToDynamicType(type, checker);
      return ts.factory.createPropertyAssignment(name, direction);
    }
  }
  throwError(typeElement, 'handleTypeElement: not implemented');
}

export function convertToDynamicType(
  type: ts.TypeNode,
  checker: ts.TypeChecker
): ts.Expression {
  if (ts.isArrayTypeNode(type)) {
    return ts.factory.createCallExpression(
      ts.factory.createIdentifier('__array__'),
      undefined,
      [convertToDynamicType(type.elementType, checker)]
    );
  } else if (ts.isTypeReferenceNode(type)) {
    const t = type.typeName;
    const symbol = checker.getSymbolAtLocation(t);
    if (symbol) {
      let result: ts.Expression | undefined = undefined;
      symbol.declarations?.forEach((decl) => {
        if (ts.isTypeAliasDeclaration(decl)) {
          const type = decl.type;
          result = convertToDynamicType(type, checker);
        } else if (ts.isInterfaceDeclaration(decl)) {
          result = ts.factory.createObjectLiteralExpression(
            decl.members.map((member) => handleTypeElement(member, checker))
          );
        }
      });
      if (!result) {
        throwError(type, 'not implemented: ' + type.getText());
      }
      return ts.factory.createCallExpression(
        ts.factory.createIdentifier('__type__'),
        undefined,
        [result]
      );
    }
  } else if (ts.isTypeLiteralNode(type)) {
    return ts.factory.createObjectLiteralExpression(
      type.members.map((member) => handleTypeElement(member, checker))
    );
  } else if (type.getText() === 'number') {
    return ts.factory.createIdentifier('__number__');
  } else if (type.getText() === 'string') {
    return ts.factory.createIdentifier('__string__');
  } else if (type.getText() === 'boolean') {
    return ts.factory.createIdentifier('__boolean__');
  } else if (type.getText() === 'object') {
    return ts.factory.createIdentifier('__object__');
  } else if (ts.isUnionTypeNode(type)) {
    return ts.factory.createCallExpression(
      ts.factory.createIdentifier('__union__'),
      undefined,
      [
        ts.factory.createArrayLiteralExpression(
          type.types.map((t) => convertToDynamicType(t, checker))
        ),
      ]
    );
  } else if (ts.isLiteralTypeNode(type)) {
    if (ts.isStringLiteral(type.literal)) {
      return ts.factory.createCallExpression(
        ts.factory.createIdentifier('__literal__'),
        undefined,
        [type.literal]
      );
    } else if (ts.isNumericLiteral(type.literal)) {
      return ts.factory.createCallExpression(
        ts.factory.createIdentifier('__literal__'),
        undefined,
        [type.literal]
      );
    }
  }
  throwError(type, `Not implemented type: ${type.getText()}`);
}
