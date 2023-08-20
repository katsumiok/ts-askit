import { Example, define } from 'ts-askit';

let e: Example[] = [];

// Write a function that reverses a string.
e = [{ input: { s: 'abc' }, output: 'cba' }];
export const reverseString = define<string, { s: string }>('Reverse the string {{s}}.', [], e);

// Write a function that returns the factorial of a number.
e = [{ input: { n: 5 }, output: 120 }];
export const factorial = define<number, { n: number }>('Calculate the factorial of {{n}}.', [], e);

// Write a function that converts an array of strings into a single concatenated string.
e = [{ input: { ss: ['a', 'b', 'c'] }, output: 'abc' }];
export const concatStrings = define<string, { ss: string[] }>('Concatenate the strings {{ss}}.', [], e);

// Write a function that sorts an array of numbers in ascending order.
e = [{ input: { ns: [3, 2, 1] }, output: [1, 2, 3] }];
export const sortNumbers = define<number[], { ns: number[] }>('Sort the numbers {{ns}} in ascending order.', [], e);

// Write a function that finds the largest number in an array.
e = [{ input: { ns: [1, 2, 3] }, output: 3 }];
export const findLargestNumber = define<number, { ns: number[] }>('Find the largest number in {{ns}}.', [], e);

// Write a function that checks if a number is a palindrome.
e = [{ input: { n: 12321 }, output: true }];
export const isPalindrome = define<boolean, { n: number }>('Check if {{n}} is a palindrome.', [], e);

// Write a function that calculates the sum of all numbers in an array.
e = [{ input: { ns: [1, 2, 3] }, output: 6 }];
export const sumNumbers = define<number, { ns: number[] }>('Calculate the sum of all numbers in {{ns}}.', [], e);

// Write a function that finds the average of all numbers in an array.
e = [{ input: { ns: [1, 2, 3] }, output: 2 }];
export const averageNumbers = define<number, { ns: number[] }>('Calculate the average of all numbers in {{ns}}.', [], e);

// Write a function that counts the number of occurrences of a specific element in an array.
e = [{ input: { xs: [1, 2, 3, 1, 2, 3], x: 1 }, output: 2 }];
export const countOccurrences = define<number, { xs: number[]; x: number }>('Count the number of occurrences of {{x}} in {{xs}}.', [], e);

// Write a function that removes all instances of a specific element from an array.
e = [{ input: { xs: [1, 2, 3, 1, 2, 3], x: 1 }, output: [2, 3, 2, 3] }];
export const removeInstances = define<number[], { xs: number[]; x: number }>('Remove all instances of {{x}} from {{xs}}.', [], e);

// Write a function that returns the unique elements in an array.
e = [{ input: { xs: [1, 2, 3, 1, 2, 3] }, output: [1, 2, 3] }];
export const uniqueElements = define<number[], { xs: number[] }>('Return the unique elements in {{xs}}.', [], e);

// Write a function that finds the factorial of a number.
e = [{ input: { n: 5 }, output: 120 }];
export const findFactorial = define<number, { n: number }>('Find the factorial of {{n}}.', [], e);

// Write a function that checks if a number is a prime number.
e = [{ input: { n: 5 }, output: true }];
export const isPrime = define<boolean, { n: number }>('Check if {{n}} is a prime number.', [], e);

// Write a function that generates the Fibonacci sequence up to a certain number.
e = [{ input: { n: 5 }, output: [0, 1, 1, 2, 3] }];
export const generateFibonacci = define<number[], { n: number }>('Generate the Fibonacci sequence up to {{n}}.', [], e);

// Write a function that finds the greatest common divisor of two numbers.
e = [{ input: { a: 12, b: 18 }, output: 6 }];
export const findGreatestCommonDivisor = define<number, { a: number; b: number }>('Find the greatest common divisor of {{a}} and {{b}}.', [], e);

// Write a function that converts a decimal number to binary.
e = [{ input: { n: 5 }, output: '101' }];
export const convertDecimalToBinary = define<string, { n: number }>('Convert the decimal number {{n}} to binary.', [], e);

// Write a function that converts a binary number to decimal.
e = [{ input: { n: '101' }, output: 5 }];
export const convertBinaryToDecimal = define<number, { n: string }>('Convert the binary number {{n}} to decimal.', [], e);

// Write a function that checks if a string is a valid email address.
e = [{ input: { s: 'xxx@xxx.xxx' }, output: true }];
export const isValidEmail = define<boolean, { s: string }>('Check if {{s}} is a valid email address.', [], e);

// Write a function that checks if a string is a valid URL.
e = [{ input: { s: 'https://www.xxx.xxx' }, output: true }];
export const isValidUrl = define<boolean, { s: string }>('Check if {{s}} is a valid URL.', [], e);

// Write a function that validates a password based on certain criteria.
e = [{ input: { s: 'Abcd!234' }, output: true }];
export const isValidPassword = define<boolean, { s: string }>('Check if {{s}} is a valid password.', [], e);

// Write a function that converts a JSON object into a string.
e = [{ input: { o: { a: 1, b: 2 } }, output: '{"a":1,"b":2}' }];
export const convertJsonToString = define<string, { o: any }>('Convert the JSON object {{o}} into a string.', [], e);

// Write a function that converts a string into a JSON object.
e = [{ input: { s: '{"a":1,"b":2}' }, output: { a: 1, b: 2 } }];
export const convertStringToJson = define<object, { s: string }>('Convert the string {{s}} into a JSON object.', [], e);

// Write a function that formats a date object into a specific string format.
/* e = [{ input: { d: new Date(2021, 1, 1) }, output: '2021-02-01' }]; */
export const formatDate = define<string, { d: Date }>('Format the date {{d}} into a specific string format.', []); 

// Write a function that finds the difference between two dates.
/* e = [{ input: { d1: new Date(2021, 1, 1), d2: new Date(2021, 1, 2) }, output: 1 }] */
export const findDateDifference = define<number, { d1: Date; d2: Date }>('Find the difference between the dates {{d1}} and {{d2}}.', []);

// Write a function that checks if a string contains only alphanumeric characters.
e = [{ input: { s: 'abc123' }, output: true }];
export const isAlphanumeric = define<boolean, { s: string }>('Check if {{s}} contains only alphanumeric characters.', [], e);

// Write a function that counts the number of vowels in a string.
e = [{ input: { s: 'abc' }, output: 1 }];
export const countVowels = define<number, { s: string }>('Count the number of vowels in {{s}}.', [], e);

// Write a function that removes duplicates from an array.
e = [{ input: { xs: [1, 2, 3, 1, 2, 3] }, output: [1, 2, 3] }];
export const removeDuplicates = define<number[], { xs: number[] }>('Remove duplicates from {{xs}}.', [], e);

// Write a function that checks if two strings are anagrams.
e = [{ input: { s1: 'abc', s2: 'cba' }, output: true }];
export const isAnagram = define<boolean, { s1: string; s2: string }>('Check if {{s1}} and {{s2}} are anagrams.', [], e);

// Write a function that finds the longest word in a string.
e = [{ input: { s: 'abcd efg' }, output: 'abcd' }];
export const findLongestWord = define<string, { s: string }>('Find the longest word in {{s}}.', [], e);

// Write a function that capitalizes the first letter of each word in a string.
e = [{ input: { s: 'abc def' }, output: 'Abc Def' }];
export const capitalizeWords = define<string, { s: string }>('Capitalize the first letter of each word in {{s}}.', [], e);

// Write a function that returns the n-th Fibonacci number.
e = [{ input: { n: 5 }, output: 5 }];
export const findNthFibonacciNumber = define<number, { n: number }>('Find the {{n}}-th Fibonacci number.', [], e);

// Write a function that finds all prime numbers up to a certain number.
e = [{ input: { n: 5 }, output: [2, 3, 5] }];
export const findPrimeNumbersUpTo = define<number[], { n: number }>('Find all prime numbers up to {{n}}.', [], e);

// Write a function that checks if a number is even or odd.
e = [{ input: { n: 5 }, output: false }];
export const isEvenOrOdd = define<boolean, { n: number }>('Check if {{n}} is even or odd.', [], e);

// Write a function that finds the square root of a number.
e = [{ input: { n: 5 }, output: 2.23606797749979 }]
export const findSquareRoot = define<number, { n: number }>('Find the square root of {{n}}.', [], e);

// Write a function that calculates the power of a number.
e = [{ input: { n: 5, p: 2 }, output: 25 }];
export const calculatePower = define<number, { n: number; p: number }>('Calculate the power of {{n}} to {{p}}.', [], e);

// Write a function that flattens a multi-dimensional array.
e = [{ input: { xs: [[1, 2], [3]] }, output: [1, 2, 3] }];
export const flattenArray = define<number[], { xs: number[][] }>('Flatten the multi-dimensional array {{xs}}.', [], e);

// Write a function that checks if a string is a valid IP address.
e = [{ input: { s: '192.168.1.1' }, output: true }];
export const isValidIpAddress = define<boolean, { s: string }>('Check if {{s}} is a valid IP address.', [], e);

// Write a function that checks if a year is a leap year.
e = [{ input: { y: 2020 }, output: true }];
export const isLeapYear = define<boolean, { y: number }>('Check if {{y}} is a leap year.', [], e);

// Write a function that finds the intersection of two arrays.
e = [{ input: { xs: [1, 2, 3], ys: [2, 3, 4] }, output: [2, 3] }];
export const findIntersection = define<number[], { xs: number[]; ys: number[] }>('Find the intersection of {{xs}} and {{ys}}.', [], e);

// Write a function that finds the union of two arrays.
e = [{ input: { xs: [1, 2, 3], ys: [2, 3, 4] }, output: [1, 2, 3, 4] }];
export const findUnion = define<number[], { xs: number[]; ys: number[] }>('Find the union of {{xs}} and {{ys}}.', [], e);

// Write a function that finds the difference between two arrays.
e = [{ input: { xs: ['a', 'b', 'c'], ys: ['b', 'c', 'd'] }, output: ['a'] }];
export const findDifference = define<string[], { xs: string[]; ys: string[] }>('Find the difference between {{xs}} and {{ys}}.', [], e);

// Write a function that counts the number of words in a string.
e = [{ input: { s: 'abc def' }, output: 2 }];
export const countWords = define<number, { s: string }>('Count the number of words in {{s}}.', [], e);

// Write a function that finds the most frequently occurring word in a string.
e = [{ input: { s: 'abc def abc' }, output: 'abc' }]
export const findMostFrequentWord = define<string, { s: string }>('Find the most frequently occurring word in {{s}}.', [], e);

// Write a function that finds the distance between two points in a 2D space.
e = [{ input: { p1: [1, 2], p2: [3, 4] }, output: 2.8284271247461903 }];
export const findDistanceBetweenTwoPoints = define<number, { p1: [number, number]; p2: [number, number] }>('Find the distance between the points {{p1}} and {{p2}}.', [], e);

// Write a function that finds the area of a triangle given its three sides.
e = [{ input: { s1: 3, s2: 4, s3: 5 }, output: 6 }];
export const findAreaOfTriangle = define<number, { s1: number; s2: number; s3: number }>('Find the area of a triangle given its three sides {{s1}}, {{s2}}, and {{s3}}.', [], e);

// Write a function that checks if a string contains a certain substring.
e = [{ input: { s: 'abc', sub: 'ab' }, output: true }];
export const containsSubstring = define<boolean, { s: string; sub: string }>('Check if {{s}} contains the substring {{sub}}.', [], e);

// Write a function that implements a basic Caesar cipher.
e = [{ input: { s: 'abc', shift: 1 }, output: 'bcd' }];
export const caesarCipher = define<string, { s: string; shift: number }>('Implement a basic Caesar cipher on {{s}} with a shift of {{shift}}.', [], e);

// Write a function that checks if a number is within a certain range.
e = [{ input: { n: 5, min: 1, max: 10 }, output: true }];
export const isWithinRange = define<boolean, { n: number; min: number; max: number }>('Check if {{n}} is within the range {{min}} to {{max}}.', [], e);

// Write a function that formats a number as a currency.
e = [{ input: { n: 5 }, output: '$5.00' }];
export const formatCurrency = define<string, { n: number }>('Format the number {{n}} as a currency.', [], e);

// Write a function that finds the mode of an array of numbers.
e = [{ input: { ns: [1, 2, 3, 1, 2, 3] }, output: 1 }];
export const findMode = define<number, { ns: number[] }>('Find the mode of the array {{ns}}.', [], e);
