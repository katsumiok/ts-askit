import { ask, Example } from 'ts-askit';

function addInBase2(x: string, y: string) {
  const example: Example[] = [
    { input: { x: '1', y: '0' }, output: '1' },
    { input: { x: '1', y: '1' }, output: '10' },
    { input: { x: '101', y: '11' }, output: '1000' },
    { input: { x: '1001', y: '110' }, output: '1111' },
    { input: { x: '1111', y: '1' }, output: '10000' },
  ];
  return ask<string>('Add {{x}} and {{y}}', example);
}

async function doit() {
  console.log(await addInBase2('101', '11'));
}

doit();
