<!-- {% raw %} -->
# AskIt (ts-askit)

## Overview

AskIt is a language plugin for TypeScript that enables you to leverage the capabilities of a large language model (LLM), such as GPT-4, directly within your programming environment, no complex APIs needed. AskIt's extensive range of applications includes:

- Translation
- Paraphrasing
- Sentiment analysis
- Math problem solving
- Code generation
- And many more...

Built upon the [OpenAI API](https://beta.openai.com/), AskIt provides a user-friendly interface for incorporating LLMs into your applications. You can use *AskIt* not only in TypeScript, but also in JavaScript and Python.

For integrating *AskIt* with JavaScript, please refer to the corresponding [JavaScript section](#use-askit-with-javascript). 

If Python is your preferred language, you can learn more about how to utilize *AskIt* by visiting our dedicated [AskIt (pyaskit) page](https://katsumiok.github.io/pyaskit/).

## Key Features

- [x] Output control for LLMs driven by TypeScript's type system
- [x] Template-based function definition
- [x] Natural Language Programming (NLP) with integrated code synthesis
- [x] Programming by Example (PBE)

## Installation

Before starting, ensure that [Node.js](http://nodejs.org/) and [npm](https://npmjs.com) are installed on your system. Then, execute the following command:

```bash
npm install ts-askit
```

This package relies on `ts-patch`. To install `ts-patch`, run:

```bash
npx ts-patch install
```

Add the following snippet to your `tsconfig.json`:

```json
"compilerOptions": {
    "plugins": [{ "transform": "ts-askit/transform" }]
}
```

This modification allows the TypeScript compiler to support type parameters for the `ask` and `define` APIs in AskIt.

The `ts-patch` package is crucial for unleashing the full potential of AskIt, as it extends the TypeScript compiler to fully integrate AskIt's type system. While AskIt can be used without `ts-patch`, this integration offers a more feature-rich experience.

Before using *AskIt*, you need to set your OpenAI API key as an environment variable `OPENAI_API_KEY` and `ASKIT_MODEL`:
```bash
export OPENAI_API_KEY=<your OpenAI API key>
```
`<you OpenAI API key>` is a string that looks like this: `sk-<your key>`.
 You can find your API key in the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

You can also specify the model name as an environment variable `ASKIT_MODEL`:
```bash
export ASKIT_MODEL=<model name>
```
`<model name>` is the name of the model you want to use. 
The latest AskIt is tested with `gpt-4` and `gpt-3.5-turbo-16k`. You can find the list of available models in the [OpenAI API documentation](https://platform.openai.com/docs/models).

## API Usage

Here are some introductory examples:

```ts
import { ask } from 'ts-askit';

ask<string>('Paraphrase "Hello World!"').then((result) => {
  console.log(result);
});
```

In this example, `ask` is an API function that allows your program to pose queries to a large language model (LLM). The type parameter represents the expected output type from the LLM. Here, the output type is `string`. The prompt is passed as an argument in natural language, describing the task for the LLM to perform. `ask` is asynchronous, returning a `Promise` of the specified output type. The code snippet above should print something like this:
```
Greetings, Universe!
```

For a prompt with parameters, you can use the `define` API as follows:

```ts
import { define } from 'ts-askit';

const paraphrase = define<string>('Paraphrase {{text}}');

paraphrase({text: 'Hello World!'}).then((result) => {
  console.log(result);
});
```

`define` is an API function that allows you to define a custom function. Its type parameter indicates the output type of the LLM, and consequently, the return value of the function. The function receives a string template as an argument, serving as the LLM's task prompt. The template can include parameters enclosed in double curly braces. In the example above, `text` is a parameter within the template, and it can be any valid JavaScript identifier.

Once the function is defined, it can be invoked like any other function. This function accepts an object as an argument, which maps to the template parameters' values. In this case, `text` maps to the string 'Hello World!'.
## Code Generation with **AskIt**

**AskIt** is adept at generating code from natural language descriptions. Here's an example:

```ts
import { ask } from 'ts-askit';

function sort(numbers: number[]){
  return ask<number[]>('Sort {{numbers}} in ascending order');
}
```

This example showcases a function that sorts an array of numbers in ascending order, utilizing the `ask` API to instruct the LLM to perform the task. While efficient in concept, this method may seem computationally heavy as each function call requires a new LLM task.

To streamline this process, we can leverage the LLM to generate the sorting function's code, rather than resorting to the LLM for every sorting task. This optimizes the function without requiring any changes in its implementation, thanks to **AskIt**'s code generation capabilities.

The code for the aforementioned function can be generated in three steps:

1. First, compile the code using the TypeScript compiler `tsc`. The **AskIt** analyzer scans the code and generates a jsonl file containing details about the `ask` API calls.
2. Next, run the ts-askit command to generate the function's code:
```bash
npx askgen <jsonl file>
```
3. Finally, recompile the code with the TypeScript compiler `tsc`. This time, the `ask` API calls are replaced by the calls to the newly generated function, thanks to **AskIt**'s auto-replacement feature.


## Programming by Example with **AskIt**

**AskIt** allows you to leverage the power of Programming by Example (PBE). PBE simplifies the programming process by enabling you to define functionality through examples rather than hard-coded logic. The following example illustrates this by showing you how to add two binary numbers using PBE with **AskIt**.

```ts
import { ask, Example } from 'ts-askit';

function addInBase2(x: string, y: string) {
  const examples: Example[] = [
    { input: { x: '1', y: '0' }, output: '1' },
    { input: { x: '1', y: '1' }, output: '10' },
    { input: { x: '101', y: '11' }, output: '1000' },
    { input: { x: '1001', y: '110' }, output: '1111' },
    { input: { x: '1111', y: '1' }, output: '10000' },
  ];
  return ask<string>('Add {{x}} and {{y}}', examples);
}
```
In this example, we have a function `addInBase2` that takes two binary numbers (represented as strings) and adds them. The `ask` function is invoked with a prompt and an array of examples. Each example in this array is an object that maps inputs to outputs. The `ask` function utilizes these examples and the prompt to interpret and execute the desired operation. 

The result is a powerful feature allowing you to instruct the LLM to perform complex operations, like binary addition, using nothing but examples. This approach enables you to develop complex functionality rapidly and with less explicit logic.

Once the function `addInBase2` is defined, you can call it with binary number strings to perform addition in base 2. As with traditional function calls, **AskIt**'s `ask` operation returns a promise that resolves with the computed result.

## Leverage **AskIt** in JavaScript

### Type-guided Output Control in JavaScript

JavaScript developers can fully exploit the potential of type-guided output control offered by **AskIt**. Just like its sibling TypeScript, JavaScript incorporates the API method `ask` to achieve this. The function `ask` takes two parameters: a type and a prompt.

Here is an array of examples demonstrating its usage:

```js
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
```

In the code snippet above, the `ask` function is invoked with a type and a prompt. The type parameter serves the purpose of informing **AskIt** about the format and structure of the desired output. This becomes extremely handy when you're dealing with complex data structures.

### Template-based Function Definition in JavaScript

With **AskIt**, JavaScript developers have the ability to define functions using easy-to-understand templates. The `define` method is the hero behind the scenes here, as it helps create functions based on the task template provided. Once created, these functions can be called with any object that provides values for the placeholders in the template.

Here's an example of how it's done:

```js
const ai = require('ts-askit')
const t = require('ts-askit/types')

let f = ai.define(t.string, 'Translate {{text}} into {{language}}');
f({text: 'Hello', language: 'French'}).then((answer) => { console.log(answer) });
```

In the code above, the `define` method is employed to establish a function `f` using a task template 'Translate {{text}} into {{language}}'. The function `f` is then invoked with an object that provides values for `text` and `language`.

### Diverse Supported Types in JavaScript

The `'ts-askit/types'` module is a treasure trove of types that you can utilize to guide **AskIt**'s output. Here's a table to help you quickly grasp these types:

| Type | Description | Type Example | Value Example |
| --- | --- | --- | --- |
| `NumberType` | Numeric type | `t.number` | 123 |
| `StringType` | String type | `t.string` | "Hello, World!" |
| `BooleanType` | Boolean type | `t.boolean` | true |
| `LiteralType` | Literal value type | `t.literal(123)` | 123 |
| `ArrayType` | Array type | `t.array(t.number)` | [1, 2, 3] |
| `UnionType` | Union type (Multiple Possible Values) | `t.union([t.literal('yes'), t.literal('no')])` | "yes" or "no" |
| `InterfaceType` | Interface/Dictionary Type | `t.type({a: t.number, b: t.number})` | {a: 1, b: 2} |
| `CodeType` | Code type | `t.code('python')` | "def hello_world(): print('Hello, World!')" |

Each type has specific properties that **AskIt** uses to comprehend the task at hand and properly format the output. 

### Code Generation in JavaScript: The Road Ahead

As of the time of writing, the code generation feature is exclusively available in TypeScript. However, efforts are in full swing to extend this powerful feature to the realm of JavaScript. If your requirements call for the use of code generation in the interim, we recommend using TypeScript until further updates.


## Contributing

For details on our code of conduct and the process for submitting pull requests, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.
<!-- {% endraw %} -->
