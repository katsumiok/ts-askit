import { ask, define } from 'ts-askit';

// Type-Guided Output Control
async function example1() {
  let sentiment = await ask<'positive' | 'negative'>(
    'What is the sentiment of the following review: "The product is fantastic. It exceeds all my expectations."'
  );
  console.log(sentiment);
}

// Type-Guided Output Control
async function example2() {
  const review = 'The product is fantastic. It exceeds all my expectations.';
  let sentiment = await ask<'positive' | 'negative'>(
    'What is the sentiment of {{review}}?'
  );
  console.log(sentiment);
}

// Template-based Function Definitions
async function example3() {
  let getSentiment = define<'positive' | 'negative'>(
    'What is the sentiment of {{review}}?'
  );

  let sentiment = await getSentiment({
    review: 'The product is fantastic. It exceeds all my expectations.',
  });
  console.log(sentiment);
}

// Code Generation
async function example4() {
  let appendReviewToCsv = define<void>(
    'Append {{review}} and {{sentiment}} as a new row in the CSV file named {{filename}}'
  );

  await appendReviewToCsv({
    filename: 'reviews.csv',
    review: 'The product is fantastic. It exceeds all my expectations.',
    sentiment: 'positive',
  });
}

async function main() {
  await example1();
  await example2();
  await example3();
  await example4();
}

main();
