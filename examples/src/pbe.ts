import { define, Example } from 'ts-askit';

const example: Example[] = [
  { input: { x: '1', y: '0' }, output: '1' },
  { input: { x: '1', y: '1' }, output: '10' },
  { input: { x: '101', y: '11' }, output: '1000' },
  { input: { x: '1001', y: '110' }, output: '1111' },
  { input: { x: '1111', y: '1' }, output: '10000' },
];
const addInBase2 = define<string, { x: string; y: string }>(
  'Add {{x}} and {{y}}',
  example
);

async function doit() {
  console.log(await addInBase2({ x: '101', y: '11' }));
}

doit();
