# describe-it

> Extracts a private function | expression | variable for BDD unit testing

[![describe-it-icon] [describe-it-icon]][describe-it-icon]

[![Build status][describe-it-ci-image] ][describe-it-ci-url]
[![dependencies][describe-it-dependencies-image] ][describe-it-dependencies-url]
[![devdependencies][describe-it-devdependencies-image] ][describe-it-devdependencies-url]

## Api

    describeIt(sourceFilename, functionSignature, useBeforeEach, testCallbacks);
    // sourceFilename - full CommonJS filename
    // functionSignature - foo(), add(a, b), etc to find the function | var name = ...
    // useBeforeEach - optional, boolean - use beforeEach when setting up (otherwise by default using before)
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
without extra processing step, like [this one][1]? Nope. Simple to do via *describe-it*, built
on top of [really-need](https://github.com/bahmutov/really-need).

    npm install --save-dev describe-it

```js
// get-foo-spec.js
// assumes BDD like Mocha
var describeIt = require('describe-it');
describeIt(__dirname + '/foo.js', 'getFoo()', function (getFn) {
  it('returns "foo"', function () {
    var getFoo = getFn();
    console.assert(getFoo() === 'foo');
  });
});
```

If you have several unit tests, just grab the function before each

```js
// get-foo-spec.js
var describeIt = require('describe-it');
describeIt(__dirname + '/foo.js', 'getFoo()', function (getFn) {
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

## Unit test any named function

You can extract and unit test even named functional expressions, commonly used as callbacks.
For example, we can unit test the function `double` used as an iterator callback in the code below

```js
// double-numbers.js
function doubleNumbers(numbers) {
  return numbers.map(function double(x) {
    return x * 2;
  });
}
```

```js
// double-numbers-spec.js
describeIt(__dirname + '/double-numbers', 'double(x)', function (getDouble) {
  before('it is executed at least once', function () {
    var doubleThem = require('./double-numbers');
    doubleThem([1, 2]);
  });
  it('doubles numbers', function () {
    var double = getDouble();
    la(double(5) === 10);
  });
});
```

Note that because our functional expression is deep inside the code, we **must execute the code at least once**
before the function `double` gets assigned.

## Unit test any assigned variable

Often I create code or values instead of having functional expressions (imperative style).
For example, instead of writing a function myself, I would [create a function using composition][4].
Using this library we can extract variables too.

```js
// variable-foo.js
var foo = 'foo';
// variable-foo-spec.js
var describe = require('describe-it');
describe(__dirname + '/variable-foo', 'var foo', function (getFoo) {
  it('has value "foo"', function () {
    la(getFoo() === "foo");
  });
});
```

Nice!

You can see this in action in the following unit test [ggit/changed-files-spec.js][5] that
tests pipeline of functions `stdoutToGrouped` in the file [ggit/changed-files.js][6].

## Note for Jasmine users

I am testing this library using [Mocha](http://mochajs.org/), which I [find much nicer](picking)
to work with.

Jasmine has a broken `afterEach` order, see the [open pull request][2] to fix it. 
Because **describe-it** tries to behave nicely and clean up after itself, you might NOT
have the function inside *your own afterEach blocks*.

```js
describeIt(..., function (getFn) {
    it(...);
    afterEach(function () {
        var fn = getFn(); 
        // Nope, fn is undefined by this time
    });
});
```

As a work around, keep the reference to the function around

```js
describeIt(..., function (getFn) {
    var fn;
    beforeEach(function () {
        fn = getFn();
    });
    it(...);
    afterEach(function () {
        // use fn
    });
});
```

[1]: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/
[2]: https://github.com/jasmine/jasmine/pull/908
[3]: http://glebbahmutov.com/blog/picking-javascript-testing-framework/
[4]: http://glebbahmutov.com/blog/imperative-to-compose-example/
[5]: https://github.com/bahmutov/ggit/blob/master/spec/changed-files-spec.js 
[6]: https://github.com/bahmutov/ggit/blob/master/src/changed-files.js

## For devs

If something is not working, you can see verbose output using an environment variable. For example
if you run unit tests that use `describe-it` via `npm test`, you can see the log messages by running

    DEBUG=describe npm test

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/describe-it/issues) on Github

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

[describe-it-icon]: https://nodei.co/npm/describe-it.png?downloads=true
[describe-it-url]: https://npmjs.org/package/describe-it
[describe-it-ci-image]: https://travis-ci.org/bahmutov/describe-it.svg?branch=master
[describe-it-ci-url]: https://travis-ci.org/bahmutov/describe-it
[describe-it-dependencies-image]: https://david-dm.org/bahmutov/describe-it.svg
[describe-it-dependencies-url]: https://david-dm.org/bahmutov/describe-it
[describe-it-devdependencies-image]: https://david-dm.org/bahmutov/describe-it/dev-status.svg
[describe-it-devdependencies-url]: https://david-dm.org/bahmutov/describe-it#info=devDependencies
