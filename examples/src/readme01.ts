import { ask } from 'ts-askit';

ask<string>('Paraphrase "Hello World!"').then((result) => {
  console.log(result);
});
