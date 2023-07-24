import { ExamplesType } from './example';

export type Info = {
  signature: string;
  desc: string;
  params: [string, string][];
  name: string;
  examples: ExamplesType;
};
