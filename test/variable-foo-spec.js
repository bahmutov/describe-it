require('lazy-ass');
var describeIt = require('..');
var sourceName = __dirname + '/variable-foo';

describeIt(sourceName, 'var foo', function (getFoo) {
  it('has value "foo"', function () {
    la(getFoo() === "foo");
  });
});

var useBeforeEach = true;
describeIt(sourceName, 'var foo', useBeforeEach, function (getFoo) {
  it('has value "foo"', function () {
    la(getFoo() === "foo");
  });

  it('has value "foo" second time', function () {
    la(getFoo() === "foo");
  });
});
