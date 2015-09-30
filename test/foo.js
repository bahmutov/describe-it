// foo.js
// function getFoo is not accessible from outside
// how to unit test it?
(function reallyPrivate() {
  function getFoo() {
    return 'foo';
  }
}());
/*
// foo-spec.js
describeIt('./foo.js', 'getFoo()', function () {
  it('returns "foo"', function () {
    la(this.getFoo() === 'foo');
  });
});
*/
