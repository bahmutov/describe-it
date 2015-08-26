var log = require('debug')('describe');
require = require('really-need');

var signatureToName = require('./src/utils').signatureToName;

function desribeFunction(filename, functionSignature, cb) {
  var fullSig = 'function ' + functionSignature;
  var functionName = signatureToName(functionSignature);
  log('describing function "%s" sig "%s" in "%s"', functionName, functionSignature, filename);

  var __exports = {};

  var options = {
    bust: true,
    pre: function (source, filename) {
      var at = source.indexOf(fullSig), changed;
      if (at >= 0) {
        if (source[at - 1] === '(') {
          /*
          Assumption: functional expression like
            [].map(function foo(x) { ... })
          */
          changed = source.replace(fullSig,
            'global.__exports.' + functionName + ' = ' + fullSig);
        } else {
          /*
          Assumption: function declaration
          function foo(x) { ... }
          */
          changed = source.replace(fullSig,
            'global.__exports.' + functionName + ' = ' + functionName + ';\n' + fullSig);
        }
        log(changed);
        return changed;
      }

      return source;
    }
  };

  beforeEach(function () {
    global.__exports = __exports;
    require(filename, options);
  });

  function returnsFn() {
    return global.__exports && global.__exports[functionName];
  }

  describe(functionSignature, cb.bind(null, returnsFn));

  afterEach(function () {
    delete global.__exports;
  });
}

module.exports = desribeFunction;
