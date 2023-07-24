import { define, ask } from 'ts-askit';

//const hello = define(t.string, 'Answer {{x}}');
//hello.call({ x: 'What is "void"' }).then((x) => console.log(x));

const hello = define<string>('Answer {{x}}');
hello({ x: 'What is "void"' }).then((x: any) => console.log(x));

const x = 123;
ask<number>('What is the next number after {{x}}?').then((x: number) =>
  console.log(x)
);
