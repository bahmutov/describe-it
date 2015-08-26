var desribeFunction = require('..');

desribeFunction(__dirname + '/foo.js', 'getFoo()', function (getFn) {
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
