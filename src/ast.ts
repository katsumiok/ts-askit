import * as ts from 'typescript';

export function generateAST(code: string): ts.SourceFile {
  const sourceFile = ts.createSourceFile(
    'test.ts', // This can be any name, it doesn't affect the result.
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  return sourceFile;
}

function extractFirstExpression(
  sourceFile: ts.SourceFile
): ts.Expression | undefined {
  for (const statement of sourceFile.statements) {
    if (ts.isExpressionStatement(statement)) {
      return statement.expression;
    }
  }
  return undefined;
}

export function printAST(ast: ts.SourceFile): void {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const result = printer.printFile(ast);
  console.log(result);
}

function expressionToString(expression: ts.Expression): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printNode(ts.EmitHint.Expression, expression, generateAST(''));
}

export function makeExpressionFromString(expression: string): ts.Expression {
  const ast = generateAST(expression);
  const result = extractFirstExpression(ast);
  if (!result) {
    throw new Error('Invalid expression');
  }
  return result;
}
