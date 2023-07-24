import ts from 'typescript';
import { throwError } from './common';

export function getIdentifierValue(
  example: ts.Identifier,
  checker: ts.TypeChecker
): any {
  // get instance of example
  const symbol = checker.getSymbolAtLocation(example);
  if (symbol) {
    // console.log(symbol.valueDeclaration);
    // get initializer
    return getSymbolValue(symbol, example, checker);
  }
  throwError(example, 'Unknown variable: ' + example.getText());
}

function getSymbolValue(
  symbol: ts.Symbol,
  example: ts.Identifier,
  checker: ts.TypeChecker
) {
  if (
    symbol.valueDeclaration &&
    ts.isVariableDeclaration(symbol.valueDeclaration)
  ) {
    const initializer = symbol.valueDeclaration.initializer;
    if (initializer) {
      return getExpressionValue(initializer, checker);
    }
  }
  throwError(example, `${symbol.name} needs to be initialized`);
}

function isBooleanLiteral(node: ts.Node): node is ts.BooleanLiteral {
  return (
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword
  );
}

function getExpressionValue(
  initializer: ts.Expression,
  checker: ts.TypeChecker
) {
  const initializerType = checker.getTypeAtLocation(initializer);
  if (ts.isArrayLiteralExpression(initializer)) {
    return getArrayValue(initializer, checker);
  } else if (ts.isObjectLiteralExpression(initializer)) {
    return getObjectValue(initializer, checker);
  } else if (ts.isStringLiteral(initializer)) {
    return getStringValue(initializer, checker);
  } else if (ts.isNumericLiteral(initializer)) {
    return getNumberValue(initializer, checker);
  } else if (ts.isIdentifier(initializer)) {
    return getIdentifierValue(initializer, checker);
  } else if (isBooleanLiteral(initializer)) {
    return getBooleanValue(initializer);
  } else {
    throwError(initializer, 'Unknown type: ' + initializer.getText());
  }
}

function getBooleanValue(booleanLiteral: ts.Node) {
  return booleanLiteral.kind === ts.SyntaxKind.TrueKeyword;
}

function getNumberValue(
  numericalLiteral: ts.NumericLiteral,
  checker: ts.TypeChecker
) {
  return JSON.parse(numericalLiteral.getText());
}

function getStringValue(
  stringLiteral: ts.StringLiteral,
  checker: ts.TypeChecker
) {
  return stringLiteral
    .getText()
    .substring(1, stringLiteral.getText().length - 1);
}

function getObjectValue(
  objLiteral: ts.ObjectLiteralExpression,
  checker: ts.TypeChecker
) {
  const result: { [key: string]: any } = {};
  objLiteral.properties.forEach((property) => {
    if (property.name && ts.isIdentifier(property.name)) {
      // get symbol of property
      const symbol = checker.getSymbolAtLocation(property.name);
      if (symbol && symbol.valueDeclaration) {
        const initializer = (symbol.valueDeclaration as any)
          .initializer as ts.Expression;
        const value = getExpressionValue(initializer, checker);
        result[property.name.escapedText.toString()] = value;
      } else {
        throwError(
          property.name,
          'Unknown variable: ' + property.name.getText()
        );
      }
    }
  });
  return result;
}

function getArrayValue(
  initializer: ts.ArrayLiteralExpression,
  checker: ts.TypeChecker
) {
  const pairs: any[] = [];
  const array = initializer as ts.ArrayLiteralExpression;

  array.elements.forEach((element) => {
    const value = getExpressionValue(element, checker);
    pairs.push(value);
  });
  return pairs;
}
