var log = require('debug')('describe');
var logChanged = require('debug')('describe-changed');

require = require('really-need');

var signatureToName = require('./src/utils').signatureToName;
var isVariable = require('./src/utils').isVariable;

function describeIt(filename, functionSignature, useBeforeEach, cb) {
  if (typeof useBeforeEach === 'function') {
    cb = useBeforeEach;
    useBeforeEach = false;
  }

  var isVar = isVariable(functionSignature);

  var fullSig = isVar ? functionSignature : 'function ' + functionSignature;
  var functionName = signatureToName(functionSignature);
  log('describing function "%s" sig "%s" in "%s"', functionName, functionSignature, filename);
  log('full signature to look for "%s"', fullSig);

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
          log('found functional expression "%s"', fullSig);
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
            log('found function declaration "%s"', fullSig);
            changed = source.replace(fullSig,
              assignment + functionName + ';\n' + fullSig);
          }
        }
        logChanged(changed);
        return changed;
      }

      return source;
    }
  };

  var beforeFn = useBeforeEach ? beforeEach : before;
  var afterFn = useBeforeEach ? afterEach : after;
  log('destroying before each unit test?', useBeforeEach);

  describe(functionSignature, function () {

    var __exports = {};

    beforeFn(function () {
      global.__exports = __exports;
      log('beforeEach with __exports =', __exports);
      require(filename, options);
    });

    function returnsFn() {
      log('returning described value, __exports keys', Object.keys(global.__exports), 'function name', functionName);
      return global.__exports && global.__exports[functionName];
    }

    log('executing describeIt callback');
    cb.call(this, returnsFn);

    afterFn(function () {
      log('deleting __exports object', global.__exports);
      delete global.__exports;
    });

  });

}

module.exports = describeIt;
