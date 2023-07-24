"use strict";

const ai = require('ts-askit')
const t = require('ts-askit/types')

ai.ask(t.number, 'What is the third prime number?').then((answer) => { console.log(answer) });
ai.ask(t.string, "What is the month number of 'January'?").then((answer) => { console.log(answer) });
ai.ask(t.array(t.number), "What are the month numbers in the second quarter?");
const monthType = t.type({
    name: t.string,
    number: t.number
})
ai.ask(monthType, "What is the month number of 'October'?").then((answer) => { console.log(answer) });
ai.ask(t.array(monthType), "What are the months in the second quarter?").then((answer) => { console.log(answer) });
