// config.ts
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';

function readConfigFile(configFilePath: string) {
  if (!fs.existsSync(configFilePath)) {
    return {};
  }
  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      ts.formatDiagnostics([configFile.error], {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    );
  }

  const basePath = path.dirname(configFilePath); // Directory of tsconfig.json
  const configParseResult = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    basePath
  );
  if (configParseResult.errors.length > 0) {
    throw new Error(
      ts.formatDiagnostics(configParseResult.errors, {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    );
  }

  return configParseResult.options;
}

const userConfig = readConfigFile(path.resolve(__dirname, './askit.json'));

console.log(userConfig);

export default {
  //  ...defaultConfig,
  ...userConfig,
};
