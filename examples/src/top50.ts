import { Example, ask } from 'ts-askit';

// Write a function that reverses a string.
function reverseString(s: string) {
  const example: Example[] = [{ input: { s: 'abc' }, output: 'cba' }];
  return ask<string>('Reverse the string {{s}}.', example);
}

// Write a function that returns the factorial of a number.
function factorial(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: 120 }];
  return ask<number>('Calculate the factorial of {{n}}.', example);
}

// Write a function that converts an array of strings into a single concatenated string.
function concatStrings(ss: string[]) {
  const example: Example[] = [
    { input: { ss: ['a', 'b', 'c'] }, output: 'abc' },
  ];
  return ask<string>('Concatenate the strings {{ss}}.', example);
}

// Write a function that sorts an array of numbers in ascending order.
function sortNumbers(ns: number[]) {
  const example: Example[] = [{ input: { ns: [3, 2, 1] }, output: [1, 2, 3] }];
  return ask<number[]>('Sort the numbers {{ns}} in ascending order.', example);
}

// Write a function that finds the largest number in an array.
function findLargestNumber(ns: number[]) {
  const example: Example[] = [{ input: { ns: [1, 2, 3] }, output: 3 }];
  return ask<number>('Find the largest number in {{ns}}.', example);
}

// Write a function that checks if a number is a palindrome.
function isPalindrome(n: number) {
  const example: Example[] = [{ input: { n: 12321 }, output: true }];
  return ask<boolean>('Check if {{n}} is a palindrome.', example);
}

// Write a function that calculates the sum of all numbers in an array.
function sumNumbers(ns: number[]) {
  const example: Example[] = [{ input: { ns: [1, 2, 3] }, output: 6 }];
  return ask<number>('Calculate the sum of all numbers in {{ns}}.', example);
}

// Write a function that finds the average of all numbers in an array.
function averageNumbers(ns: number[]) {
  const example: Example[] = [{ input: { ns: [1, 2, 3] }, output: 2 }];
  return ask<number>(
    'Calculate the average of all numbers in {{ns}}.',
    example
  );
}

// Write a function that counts the number of occurrences of a specific element in an array.
function countOccurrences(xs: number[], x: number) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3, 1, 2, 3], x: 1 }, output: 2 },
  ];
  return ask<number>(
    'Count the number of occurrences of {{x}} in {{xs}}.',
    example
  );
}

// Write a function that removes all instances of a specific element from an array.
function removeInstances(xs: number[], x: number) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3, 1, 2, 3], x: 1 }, output: [2, 3, 2, 3] },
  ];
  return ask<number[]>('Remove all instances of {{x}} from {{xs}}.', example);
}

// Write a function that returns the unique elements in an array.
function uniqueElements(xs: number[]) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3, 1, 2, 3] }, output: [1, 2, 3] },
  ];
  return ask<number[]>('Return the unique elements in {{xs}}.', example);
}

// Write a function that finds the factorial of a number.
function findFactorial(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: 120 }];
  return ask<number>('Find the factorial of {{n}}.', example);
}

// Write a function that checks if a number is a prime number.
function isPrime(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: true }];
  return ask<boolean>('Check if {{n}} is a prime number.', example);
}

// Write a function that generates the Fibonacci sequence up to a certain number.
function generateFibonacci(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: [0, 1, 1, 2, 3] }];
  return ask<number[]>('Generate the Fibonacci sequence up to {{n}}.', example);
}
// ... Previous function definitions are correct ...

// Write a function that finds the greatest common divisor of two numbers.
function findGreatestCommonDivisor(a: number, b: number) {
  const example: Example[] = [{ input: { a: 12, b: 18 }, output: 6 }];
  return ask<number>(
    'Find the greatest common divisor of {{a}} and {{b}}.',
    example
  );
}

// Write a function that converts a decimal number to binary.
function convertDecimalToBinary(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: '101' }];
  return ask<string>('Convert the decimal number {{n}} to binary.', example);
}

// Write a function that converts a binary number to decimal.
function convertBinaryToDecimal(n: string) {
  const example: Example[] = [{ input: { n: '101' }, output: 5 }];
  return ask<number>('Convert the binary number {{n}} to decimal.', example);
}

// Write a function that checks if a string is a valid email address.
function isValidEmail(s: string) {
  const example: Example[] = [{ input: { s: 'xxx@xxx.xxx' }, output: true }];
  return ask<boolean>('Check if {{s}} is a valid email address.', example);
}

// Write a function that checks if a string is a valid URL.
function isValidUrl(s: string) {
  const example: Example[] = [
    { input: { s: 'https://www.xxx.xxx' }, output: true },
  ];
  return ask<boolean>('Check if {{s}} is a valid URL.', example);
}

// Write a function that validates a password based on certain criteria.
function isValidPassword(s: string) {
  const example: Example[] = [{ input: { s: 'Abcd!234' }, output: true }];
  return ask<boolean>('Check if {{s}} is a valid password.', example);
}

// Write a function that converts a JSON object into a string.
function convertJsonToString(o: any) {
  const example: Example[] = [
    { input: { o: { a: 1, b: 2 } }, output: '{"a":1,"b":2}' },
  ];
  return ask<string>('Convert the JSON object {{o}} into a string.', example);
}

// Write a function that converts a string into a JSON object.
function convertStringToJson(s: string) {
  const example: Example[] = [
    { input: { s: '{"a":1,"b":2}' }, output: { a: 1, b: 2 } },
  ];
  return ask<object>('Convert the string {{s}} into a JSON object.', example);
}

// Write a function that formats a date object into a specific string format.
function formatDate(d: Date) {
  const example: Example[] = [
    { input: { d: new Date(2021, 1, 1) }, output: '2021-02-01' },
  ];
  return ask<string>(
    'Format the date {{d}} into a specific string format.'
    //    example
  );
}

// Write a function that finds the difference between two dates.
function findDateDifference(d1: Date, d2: Date) {
  const example: Example[] = [
    {
      input: { d1: new Date(2021, 1, 1), d2: new Date(2021, 1, 2) },
      output: 1,
    },
  ];
  return ask<number>(
    'Find the difference between the dates {{d1}} and {{d2}}.'
    //    example
  );
}

// Write a function that checks if a string contains only alphanumeric characters.
function isAlphanumeric(s: string) {
  const example: Example[] = [{ input: { s: 'abc123' }, output: true }];
  return ask<boolean>(
    'Check if {{s}} contains only alphanumeric characters.',
    example
  );
}

// Write a function that counts the number of vowels in a string.
function countVowels(s: string) {
  const example: Example[] = [{ input: { s: 'abc' }, output: 1 }];
  return ask<number>('Count the number of vowels in {{s}}.', example);
}

// Write a function that removes duplicates from an array.
function removeDuplicates(xs: number[]) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3, 1, 2, 3] }, output: [1, 2, 3] },
  ];
  return ask<number[]>('Remove duplicates from {{xs}}.', example);
}

// Write a function that checks if two strings are anagrams.
function isAnagram(s1: string, s2: string) {
  const example: Example[] = [
    { input: { s1: 'abc', s2: 'cba' }, output: true },
  ];
  return ask<boolean>('Check if {{s1}} and {{s2}} are anagrams.', example);
}

// Write a function that finds the longest word in a string.
function findLongestWord(s: string) {
  const example: Example[] = [{ input: { s: 'abcd efg' }, output: 'abcd' }];
  return ask<string>('Find the longest word in {{s}}.', example);
}

// Write a function that capitalizes the first letter of each word in a string.
function capitalizeWords(s: string) {
  const example: Example[] = [{ input: { s: 'abc def' }, output: 'Abc Def' }];
  return ask<string>(
    'Capitalize the first letter of each word in {{s}}.',
    example
  );
}

// Write a function that returns the n-th Fibonacci number.
function findNthFibonacciNumber(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: 5 }];
  return ask<number>('Find the {{n}}-th Fibonacci number.', example);
}

// Write a function that finds all prime numbers up to a certain number.
function findPrimeNumbersUpTo(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: [2, 3, 5] }];
  return ask<number[]>('Find all prime numbers up to {{n}}.', example);
}

// Write a function that checks if a number is even or odd.
function isEvenOrOdd(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: false }];
  return ask<boolean>('Check if {{n}} is even or odd.', example);
}

// Write a function that finds the square root of a number.
function findSquareRoot(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: 2.23606797749979 }];
  return ask<number>('Find the square root of {{n}}.', example);
}

// Write a function that calculates the power of a number.
function calculatePower(n: number, p: number) {
  const example: Example[] = [{ input: { n: 5, p: 2 }, output: 25 }];
  return ask<number>('Calculate the power of {{n}} to {{p}}.', example);
}

// Write a function that flattens a multi-dimensional array.
function flattenArray(xs: number[][]) {
  const example: Example[] = [
    { input: { xs: [[1, 2], [3]] }, output: [1, 2, 3] },
  ];
  return ask<number[]>('Flatten the multi-dimensional array {{xs}}.', example);
}

// Write a function that checks if a string is a valid IP address.
function isValidIpAddress(s: string) {
  const example: Example[] = [{ input: { s: '192.168.1.1' }, output: true }];
  return ask<boolean>('Check if {{s}} is a valid IP address.', example);
}

// Write a function that checks if a year is a leap year.
function isLeapYear(y: number) {
  const example: Example[] = [{ input: { y: 2020 }, output: true }];
  return ask<boolean>('Check if {{y}} is a leap year.', example);
}

// Write a function that finds the intersection of two arrays.
function findIntersection(xs: number[], ys: number[]) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3], ys: [2, 3, 4] }, output: [2, 3] },
  ];
  return ask<number[]>('Find the intersection of {{xs}} and {{ys}}.', example);
}

// Write a function that finds the union of two arrays.
function findUnion(xs: number[], ys: number[]) {
  const example: Example[] = [
    { input: { xs: [1, 2, 3], ys: [2, 3, 4] }, output: [1, 2, 3, 4] },
  ];
  return ask<number[]>('Find the union of {{xs}} and {{ys}}.', example);
}

// Write a function that finds the difference between two arrays.
function findDifference(xs: string[], ys: string[]) {
  const example: Example[] = [
    { input: { xs: ['a', 'b', 'c'], ys: ['b', 'c', 'd'] }, output: ['a'] },
  ];
  return ask<string[]>(
    'Find the difference between {{xs}} and {{ys}}.',
    example
  );
}

// Write a function that counts the number of words in a string.
function countWords(s: string) {
  const example: Example[] = [{ input: { s: 'abc def' }, output: 2 }];
  return ask<number>('Count the number of words in {{s}}.', example);
}

// Write a function that finds the most frequently occurring word in a string.
function findMostFrequentWord(s: string) {
  const example: Example[] = [{ input: { s: 'abc def abc' }, output: 'abc' }];
  return ask<string>(
    'Find the most frequently occurring word in {{s}}.',
    example
  );
}

// Write a function that finds the distance between two points in a 2D space.
function findDistanceBetweenTwoPoints(
  p1: [number, number],
  p2: [number, number]
) {
  const example: Example[] = [
    { input: { p1: [1, 2], p2: [3, 4] }, output: 2.8284271247461903 },
  ];
  return ask<number>(
    'Find the distance between the points {{p1}} and {{p2}}.',
    example
  );
}

// Write a function that finds the area of a triangle given its three sides.
function findAreaOfTriangle(s1: number, s2: number, s3: number) {
  const example: Example[] = [{ input: { s1: 3, s2: 4, s3: 5 }, output: 6 }];
  return ask<number>(
    'Find the area of a triangle given its three sides {{s1}}, {{s2}}, and {{s3}}.',
    example
  );
}

// Write a function that checks if a string contains a certain substring.
function containsSubstring(s: string, sub: string) {
  const example: Example[] = [{ input: { s: 'abc', sub: 'ab' }, output: true }];
  return ask<boolean>(
    'Check if {{s}} contains the substring {{sub}}.',
    example
  );
}

// Write a function that implements a basic Caesar cipher.
function caesarCipher(s: string, shift: number) {
  const example: Example[] = [{ input: { s: 'abc', shift: 1 }, output: 'bcd' }];
  return ask<string>(
    'Implement a basic Caesar cipher on {{s}} with a shift of {{shift}}.',
    example
  );
}

// Write a function that checks if a number is within a certain range.
function isWithinRange(n: number, min: number, max: number) {
  const example: Example[] = [
    { input: { n: 5, min: 1, max: 10 }, output: true },
  ];
  return ask<boolean>(
    'Check if {{n}} is within the range {{min}} to {{max}}.',
    example
  );
}

// Write a function that formats a number as a currency.
function formatCurrency(n: number) {
  const example: Example[] = [{ input: { n: 5 }, output: '$5.00' }];
  return ask<string>('Format the number {{n}} as a currency.', example);
}

// Write a function that finds the mode of an array of numbers.
function findMode(ns: number[]) {
  const example: Example[] = [{ input: { ns: [1, 2, 3, 1, 2, 3] }, output: 1 }];
  return ask<number>('Find the mode of the array {{ns}}.', example);
}

// Write a function that checks if an array is sorted in ascending order.
function isSortedAscending(ns: number[]) {
  const example: Example[] = [{ input: { ns: [1, 2, 3] }, output: true }];
  return ask<boolean>(
    'Check if the array {{ns}} is sorted in ascending order.',
    example
  );
}
