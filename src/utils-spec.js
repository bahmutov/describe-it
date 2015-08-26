require('lazy-ass');

describe('signature to name', function () {
  var toName = require('./utils').signatureToName;

  it('extracts name from empty args', function () {
    var name = toName('getFoo()');
    la(name === 'getFoo');
  });

  it('extracts name from single arg', function () {
    var name = toName('double(x)');
    la(name === 'double');
  });
});
