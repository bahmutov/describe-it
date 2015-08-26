// function getFoo is not accessible from outside
// how to unit test it?
(function reallyPrivate() {
  function getFoo() {
    return 'foo';
  }
}());
