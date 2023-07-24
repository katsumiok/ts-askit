import * as ts from 'typescript';

export function createExpressionFromJSON(json: string): ts.Expression {
  // Create a SourceFile from the JSON, wrapped in parentheses so it's treated as an expression
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    json,
    ts.ScriptTarget.ES2015,
    true
  );
  let expression: ts.Expression | undefined;

  const visit = (node: ts.Node) => {
    // Check if the node is a expression
    if (ts.isExpression(node)) {
      expression = node;
      return;
    }

    ts.forEachChild(node, visit);
  };

  // Start the visiting process
  visit(sourceFile);

  if (!expression) {
    throw new Error('No expression found in JSON');
  }

  return expression;
}

export function extractFunction(code: string, name: string) {
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    code,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ true
  );

  let exampleFunction: ts.FunctionDeclaration | undefined;

  const visit = (node: ts.Node) => {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name?.getText(sourceFile) === name
    ) {
      exampleFunction = node;
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return exampleFunction;
}

const code2 = `
async function example(n: number) {
  const prompt = \`Find prime numbers less than 'n'.
  where 'n' = $\{n\}

  The only final answer should be an array of numbers in JSON format.
  Here is an example of an array of numbers in JSON format:
\`\`\`json
[1, 2, 3]
\`\`\`;
\`;
  const rawResult = await ask(prompt);
  const result = parse(rawResult) as number[];
  return result;
}
`;

const code = `
async function example(n: number) {
  const prompt = "Find prime numbers";
  const rawResult = await ask(prompt);
  const result = parse(rawResult) as number[];
  return result;
}
`;

const funcNode = extractFunction(code, 'example') as ts.FunctionDeclaration;
