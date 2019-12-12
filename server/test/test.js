var assert = require('assert');

// Example test cases
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 wheb value is ot present', function() {
      assert.equal([1,2,3].indexOf(1), 0);
    });
  });
});