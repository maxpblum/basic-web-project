import {getGreeting} from './lib.mjs';

describe('getGreeting', () => {
  it('greets the user by name', () => {
    expect(getGreeting('alice')).toEqual('alice');
  });
});
