import { define } from 'ts-askit';

const paraphrase = define<string>('Paraphrase {{text}}');

paraphrase({ text: 'Hello World!' }).then((result) => {
  console.log(result);
});
