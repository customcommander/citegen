var tap = require('tap');
var td = require('testdouble');
var chooseFn = require('./choose'); // Subject Under Test

var choose = chooseFn({},  // locales
                      {},  // macros
                      {}); // attributes

tap.test('should invoke children until one returns a non-empty string', t => {
  var ref = {};
  var fn1 = td.function();
  var fn2 = td.function();
  var fn3 = td.function();

  td.when(fn1(ref)).thenReturn('');
  td.when(fn2(ref)).thenReturn('foo');
  td.when(fn3(ref)).thenReturn('bar');

  var out = choose([fn1, fn2, fn3], ref);
  t.is(out, 'foo');
  t.end();
});
