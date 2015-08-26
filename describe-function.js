require = require('really-need');

function desribeFunction(filename, functionSignature, cb) {
  var functionName = functionSignature.split(/[ \(]/)[0];
  console.log('describing function "%s" sig "%s" in "%s"', functionName, functionSignature, filename);

  var options = {
    bust: true,
    pre: function (source, filename) {
      var changed = source.replace('function ' + functionSignature,
        'global.__exports.fn = ' + functionName + ';\n' + 'function ' + functionSignature);
      return changed;
    }
  };

  beforeEach(function () {
    global.__exports = {};
    require(filename, options);
  });

  function returnsFn() {
    return global.__exports && global.__exports.fn;
  }

  describe(functionSignature, cb.bind(null, returnsFn));

  afterEach(function () {
    delete global.__exports;
  });
}

module.exports = desribeFunction;
