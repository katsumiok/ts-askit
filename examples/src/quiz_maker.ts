import { ask } from 'ts-askit';

interface DescriptiveQuiz {
  question: string;
  answer: string;
}

async function makeDescQuiz(n: number, m: number) {
  return ask<DescriptiveQuiz[]>(
    'Create {{n}} software engineering descriptive questions and answers, each with a perfect score of {{m}}.'
  );
}

type Grade = { score: number; reason: string };

async function grade(q: string, a: string, m: string, n: number) {
  return await ask<Grade>(
    'Grade the question {{q}} and answer {{a}} by comparing them with the model answer {{m}}, out of a perfect score of {{n}}'
  );
}

function summarize(s: string, n: number) {
  ask<string>('Please summarize {{s}} in {{n}} words.');
}

async function judge(answers: string[], quizes: DescriptiveQuiz[]) {
  let total = 0;
  let reason = '';
  answers.forEach(async (a, i) => {
    const s = await grade(quizes[i].question, a, quizes[i].answer, 10);
    total += s.score;
    reason += `Q{{i}}` + s.reason;
  });
  const summery = await summarize(reason, 10);
  return { total: total, reason: summery };
}

async function doit() {
  const s = await makeDescQuiz(10, 10);
  const answers = s.map((q) => q.answer);
  answers.forEach((a) => console.log(a));
}

doit();
