# describe-function

> Extracts a private function for BDD unit testing

[![describe-function-icon] [describe-function-icon]][describe-function-icon]

[![Build status][describe-function-ci-image] ][describe-function-ci-url]
[![dependencies][describe-function-dependencies-image] ][describe-function-dependencies-url]
[![devdependencies][describe-function-devdependencies-image] ][describe-function-devdependencies-url]

## Api

    describeFunction(sourceFilename, functionSignature, testCallbacks);
    // sourceFilename - full CommonJS filename
    // functionSignature - foo(), add(a, b), etc to find the function
    // testCallbacks - BDD test callback, like in "describe"

## Example

Imagine you want to unit test function `getFoo` from file `get-foo.js`

```js
// get-foo.js
(function reallyPrivate() {
  function getFoo() {
    return 'foo';
  }
}());
```

How would you do this? The function `getFoo` is private to the closure, not exported. Impossible
without extra processing step, like [this one][1]? Nope. Simple to do via *describe-function*, built
on top of [really-need](https://github.com/bahmutov/really-need).

    npm install --save-dev describe-function

```js
// get-foo-spec.js
// assumes BDD like Mocha
var describeFunction = require('describe-function');
describeFunction(__dirname + '/foo.js', 'getFoo()', function (getFn) {
  it('returns "foo"', function () {
    var getFoo = getFn();
    console.assert(getFoo() === 'foo');
  });
});
```

If you have several unit tests, just grab the function before each

```js
// get-foo-spec.js
var describeFunction = require('describe-function');
describeFunction(__dirname + '/foo.js', 'getFoo()', function (getFn) {
  var getFoo;
  beforeEach(function () {
    getFoo = getFn();
  });
  it('is a function', function () {
    console.assert(typeof getFoo === 'function');
  });
  it('returns "foo"', function () {
    console.assert(getFoo() === 'foo');
  });
});
```

[1]: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/describe-function/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[describe-function-icon]: https://nodei.co/npm/describe-function.png?downloads=true
[describe-function-url]: https://npmjs.org/package/describe-function
[describe-function-ci-image]: https://travis-ci.org/bahmutov/describe-function.svg?branch=master
[describe-function-ci-url]: https://travis-ci.org/bahmutov/describe-function
[describe-function-dependencies-image]: https://david-dm.org/bahmutov/describe-function.svg
[describe-function-dependencies-url]: https://david-dm.org/bahmutov/describe-function
[describe-function-devdependencies-image]: https://david-dm.org/bahmutov/describe-function/dev-status.svg
[describe-function-devdependencies-url]: https://david-dm.org/bahmutov/describe-function#info=devDependencies
