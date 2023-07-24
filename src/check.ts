import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export function checkProgram(code: string): string[] {
  // Read tsconfig.json
  const configFileName = path.resolve(process.cwd(), 'tsconfig.json'); // Adjust this path as necessary
  const configFileText = fs.readFileSync(configFileName).toString();
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText);

  if (result.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(result.error.messageText, '\n')
    );
  }

  // Parse JSON content
  const config = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(configFileName)
  );
  const options = { ...config.options, noEmit: true, strict: true };

  const sourceFile = ts.createSourceFile(
    'temp.ts',
    code,
    ts.ScriptTarget.Latest,
    true
  );

  const host = ts.createCompilerHost(options);

  const originalGetSourceFile = host.getSourceFile;
  host.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile
  ) => {
    if (fileName === 'temp.ts') {
      return sourceFile;
    }
    return originalGetSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile
    );
  };

  const program = ts.createProgram([sourceFile.fileName], options, host);
  const emitResult = program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const formattedDiagnostics = diagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      return `${diagnostic.file.fileName} (${line + 1},${
        character + 1
      }): ${message}`;
    } else {
      return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    }
  });

  return formattedDiagnostics;
}
