import ts from 'typescript';

export function throwError(node: ts.Node, messageText: string): never {
  const line = ts.getLineAndCharacterOfPosition(
    node.getSourceFile(),
    node.getStart()
  );

  let diagnostic: ts.Diagnostic = {
    file: node.getSourceFile(),
    start: node.getStart(),
    length: node.getWidth(),
    messageText: messageText,
    category: ts.DiagnosticCategory.Error,
    code: 9999, // Custom error code
  };

  const message = ts.formatDiagnosticsWithColorAndContext([diagnostic], {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine,
  });
  throw new Error(message);
}
