import { define } from '../src/function';
import * as t from '../src/types';

describe('Define', () => {
  it('xxx', async () => {
    const f = define(t.number, 'Find the third prime number.');
    const number = await f({});
    expect(number).toEqual(5);
  }, 10000);
});
