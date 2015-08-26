require('lazy-ass');
var add = require('./add');

describe('exported function add', function () {
  it('is a function', function () {
    la(typeof add === 'function');
  });

  it('adds numbers', function () {
    la(add(2, 3) === 5);
  });
});
