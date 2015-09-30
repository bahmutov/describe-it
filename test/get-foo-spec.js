var describeIt = require('..');
var fooFilename = __dirname + '/foo.js';

describeIt(fooFilename, 'getFoo()', function (getFn) {
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

describeIt(fooFilename, 'getFoo()', function (getFn) {
  it('returns "foo"', function () {
    var getFoo = getFn();
    la(getFoo() === 'foo');
  });
});

describe('extracting value before each unit test', function () {
  describeIt(fooFilename, 'getFoo()', function (getFn) {
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
});

describe('storing extracted value on the context object', function () {
  describeIt(fooFilename, 'getFoo()', function (getFn) {
    beforeEach(function () {
      this.getFoo = getFn();
    });

    it('returns "foo"', function () {
      la(this.getFoo() === 'foo');
    });
  });
});

describe('assign shortcut', function () {
  describeIt(fooFilename, 'getFoo()', function (getFn) {
    function assign(property, get) {
      this[property] = get();
      return this[property];
    }

    beforeEach(assign.bind(this.ctx, 'getFoo', getFn));

    it('returns "foo"', function () {
      la(this.getFoo() === 'foo');
    });
  });
});

describe('automatic assign to property', function () {
  describeIt(fooFilename, 'getFoo()', function () {
    it('assigns getFoo to property', function () {
      la(typeof this.getFoo === 'function', 'has getFoo function');
    });

    it('returns "foo"', function () {
      la(this.getFoo() === 'foo');
    });
  });
});
