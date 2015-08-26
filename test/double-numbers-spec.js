require('lazy-ass');
var describeFunction = require('..');

describe('double numbers', function () {
  it('works', function () {
    var doubleThem = require('./double-numbers');
    la(typeof doubleThem === 'function');
    var doubled = doubleThem([1, 4]);
    la(doubled[0] === 2);
    la(doubled[1] === 8);
  });
});

describeFunction(__dirname + '/double-numbers', 'double(x)', function (getDouble) {
  before('it is executed at least once', function () {
    var doubleThem = require('./double-numbers');
    doubleThem([1, 2]);
  });

  it('was extracted', function () {
    console.log('in "was extracted" test');
    var double = getDouble();
    la(typeof double === 'function');
  });

  it('doubles numbers', function () {
    var double = getDouble();
    la(double(5) === 10);
  });
});
