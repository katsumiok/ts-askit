"use strict";

const ai = require('ts-askit')
const t = require('ts-askit/types')

let f = ai.define(t.string, 'Translate {{text}} into {{language}}');
f.call({text: 'Hello', language: 'French'}).then((answer) => { console.log(answer) });


