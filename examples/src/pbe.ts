import { define, Example } from 'ts-askit';

const trainingExamples: Example[] = [
  { input: { x: '1', y: '0' }, output: '1' },
  { input: { x: '1', y: '1' }, output: '10' },
  { input: { x: '101', y: '11' }, output: '1000' },
  { input: { x: '1001', y: '110' }, output: '1111' },
  { input: { x: '1111', y: '1' }, output: '10000' },
];
const testExamples = [
  { input: { x: '0', y: '1' }, output: '1' },
  { input: { x: '10', y: '0' }, output: '10' },
  { input: { x: '110', y: '10' }, output: '1000' },
];
const addInBase2 = define<string, { x: string; y: string }>(
  'Add {{x}} and {{y}}',
  trainingExamples,
  testExamples
);

async function doit() {
  console.log(await addInBase2({ x: '101', y: '11' }));
}

doit();
