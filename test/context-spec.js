var desribeFunction = require('..');
var fooFilename = __dirname + '/foo.js';

desribeFunction(fooFilename, 'getFoo()', function (getFn) {
  console.assert(this !== global, 'this is global in describe callback');

  beforeEach(function () {
    console.assert(this !== global, 'this is global in beforeEach');
  });

  it('preserves context in spec', function () {
    console.assert(this !== global, 'this is global in spec');
  });
});
