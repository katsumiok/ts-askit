import { ExamplesType } from './example';

export type Info = {
  signature: string;
  desc: string;
  params: [string, string][];
  name: string;
  trainingExamples: ExamplesType;
  testExamples: ExamplesType;
};
