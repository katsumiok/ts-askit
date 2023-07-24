function removeDuplicates(myList: string[]): string[] {
  return [...new Set(myList)];
}

export function extractVariables(templateString: string): string[] {
  const pattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const placeholders = templateString.match(/\{\{\s*.*?\s*\}\}/g) || [];
  const variables = placeholders.map((placeholder) =>
    placeholder.substring(2, placeholder.length - 2).trim()
  );
  const allValid = variables.every((variable) => pattern.test(variable));
  if (!allValid) {
    throw new Error('Invalid variable name');
  }
  return removeDuplicates(variables);
}

export function convertTemplate(templateString: string): string {
  return templateString.replace(/\{\{\s*(.*?)\s*\}\}/g, "'$1'");
}
