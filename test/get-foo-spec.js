var desribeFunction = require('..');
var fooFilename = __dirname + '/foo.js';

desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  it('has function argument', function () {
    la(typeof getFn === 'function');
  });

  it('returns actual function', function () {
    var fn = getFn();
    la(typeof fn === 'function');
  });

  it('works', function () {
    var getFoo = getFn();
    la(getFoo() === 'foo');
  });
});

desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  it('returns "foo"', function () {
    var getFoo = getFn();
    la(getFoo() === 'foo');
  });
});

desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  var getFoo;

  beforeEach(function () {
    getFoo = getFn();
  });

  it('returns "foo"', function () {
    la(getFoo() === 'foo');
  });

  afterEach(function () {
    la(getFn() === getFoo);
  });
});

// storing value in 'this'
desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  beforeEach(function () {
    this.getFoo = getFn();
  });

  it('returns "foo"', function () {
    la(this.getFoo() === 'foo');
  });
});

// using assign shortcut
desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  function assign(property, get) {
    this[property] = get();
    return this[property];
  }

  beforeEach(assign.bind(this.ctx, 'getFoo', getFn));

  it('returns "foo"', function () {
    la(this.getFoo() === 'foo');
  });
});

// using automatic assign to property
/*
desribeFunction(fooFilename, 'getFoo()', function () {
  it('assigns getFoo to property', function () {
    la(typeof this.getFoo === 'function', 'has getFoo function');
  });

  it('returns "foo"', function () {
    la(this.getFoo() === 'foo');
  });
});
*/
