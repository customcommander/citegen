var tap = require('tap');
var assertChildren = require('./assert-children'); // Subject Under Test

function func(name) {
  var fn = function () {};
  fn.type = name;
  return fn;
}

tap.throws(() => assertChildren(null), 'Expected `children` to be an array');
tap.throws(() => assertChildren([]), 'Expected `children` to be a non-empty array');
tap.throws(() => assertChildren(['a'], [':)']), 'Unexpected non-function item(s) in `children` at position 0');
tap.throws(() => assertChildren(['a', 'b'], [':)']), 'Unexpected non-function item(s) in `children` at position 0 and 1');
tap.throws(() => assertChildren(['a', 'b', 'c'], [':)']), 'Unexpected non-function item(s) in `children` at position 0, 1 and 2');
tap.throws(() => assertChildren([func('a')], [':)']), 'Unexpected item(s) in `children` at position 0');
tap.throws(() => assertChildren([func('a'), func('b')], [':)']), 'Unexpected item(s) in `children` at position 0 and 1');
tap.throws(() => assertChildren([func('a'), func('b'), func('c')], [':)']), 'Unexpected item(s) in `children` at position 0, 1 and 2');
tap.doesNotThrow(() => assertChildren([func(':)')], [':)']), 'Should not throw if `children` is valid');


