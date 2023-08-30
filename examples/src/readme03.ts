import { define } from 'ts-askit';

const sort = define<number[], { numbers: number[] }>(
  'Sort {{numbers}} in ascending order'
);
