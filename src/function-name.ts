import * as crypto from 'crypto-js';

import { transliterate } from 'transliteration';

function normalize(text: string): string {
  // Transliterate to Latin script
  text = transliterate(text);

  // Normalize to lowercase
  text = text.toLowerCase();

  // Remove non-alphanumeric characters and standardize whitespace
  text = text.replace(/\W+/g, ' ');
  return text;
}

function shorten(
  text: string,
  maxWords: number = 5,
  maxLength: number = 10
): string[] {
  // Split the description into words
  let words = text.split(' ');
  // Take only the first few words
  words = words.slice(0, maxWords);
  // Truncate each word after a certain number of characters
  words = words.map((word) => word.substring(0, maxLength));
  return words;
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

function encode(words: string[]): string {
  // Join words with underscores to form a JavaScript identifier
  let identifier = words.join('_');
  return toCamelCase(identifier);
}

export function generateUniqueFunctionName(description: string): string {
  let normalized = normalize(description);
  let shortened = shorten(normalized);
  let name = encode(shortened);
  // Append a hash of the original description
  let hashObject = crypto.MD5(description);
  let hexDig = hashObject.toString();
  let shortHash = hexDig.substring(0, 6); // Take only first 6 characters
  let uniqueName = `${name}_${shortHash}`;
  return uniqueName;
}
