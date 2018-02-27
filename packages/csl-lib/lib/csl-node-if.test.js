var tap = require('tap');
var td = require('testdouble');
var ifFn = require('./csl-node-if'); // Subject Under Test

tap.test('should invoke all children with ref and concatenate their results', t => {
  var ref = {};
  var foo = td.function();
  var bar = td.function();
  var baz = td.function();

  td.when(foo(ref)).thenReturn('foo');
  td.when(bar(ref)).thenReturn('bar');
  td.when(baz(ref)).thenReturn('baz');

  var iff = ifFn(/* locales */ {}, /* macros */ {}, /* attributes */ {});
  var out = iff([foo, bar, baz], ref);
  t.is(out, 'foobarbaz');
  t.end();
});
