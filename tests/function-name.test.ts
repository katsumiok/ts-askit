import { generateUniqueFunctionName } from '../src/function-name';

describe('generate', () => {
  it('Handle non English letters', () => {
    const task = 'アイウエオ';
    expect(generateUniqueFunctionName(task)).toEqual('aiueo_b143b8');
  });
});
