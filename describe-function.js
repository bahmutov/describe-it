var log = require('debug')('describe');
require = require('really-need');

var signatureToName = require('./src/utils').signatureToName;
var isVariable = require('./src/utils').isVariable;

function desribeFunction(filename, functionSignature, cb) {
  var isVar = isVariable(functionSignature);

  var fullSig = isVar ? functionSignature : 'function ' + functionSignature;
  var functionName = signatureToName(functionSignature);
  log('describing function "%s" sig "%s" in "%s"', functionName, functionSignature, filename);
  log('full signature to look for "%s"', fullSig);

  var __exports = {};

  var options = {
    bust: true,
    pre: function (source, filename) {
      var at = source.indexOf(fullSig), changed;
      var assignment = 'global.__exports.' + functionName + ' = ';

      if (at >= 0) {
        if (source[at - 1] === '(') {
          /*
          Assumption: functional expression like
            [].map(function foo(x) { ... })
          */
          changed = source.replace(fullSig,
            assignment + fullSig);
        } else {
          if (isVar) {
            /* assumption: var declaration and assignment in 1 statement
              might go over several lines!
              var foo = ...;
            */
            log('found variable "%s"', fullSig);
            var assignmentEndsAt = source.indexOf(';', at);
            log('full assignment "%s"', source.substr(at, assignmentEndsAt - at + 1));
            changed = source.substr(0, assignmentEndsAt + 1) + assignment + functionName + ';' +
              source.substr(assignmentEndsAt + 1);
          } else {
            /*
            Assumption: function declaration
            function foo(x) { ... }
            */
            changed = source.replace(fullSig,
              assignment + functionName + ';\n' + fullSig);
          }
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
