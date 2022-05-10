import {handler} from './hello';

describe('handler', () => {
  it('should export handler', () => {
    expect(handler).toBeDefined();
  });
});
