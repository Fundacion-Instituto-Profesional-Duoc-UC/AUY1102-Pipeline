const assert = require('assert');
const sum = require('../src/sum');

describe('Sum Function', function() {
  it('should return the sum of two numbers', function() {
    assert.strictEqual(sum(1, 2), 3);
  });
});

