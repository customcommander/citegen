var tap = require('tap');
var td = require('testdouble');
var ifFn = require('./csl-node-if'); // Subject Under Test

tap.test('should support the type attribute', t => {
  var iff = ifFn(/* locales */ {}, /* macros */ {});
  var ref = {type: 'article'};
  var foo = td.function();
  var out;

  out = iff({type: 'draft'}, [foo], ref);
  t.is(out, '');

  td.when(foo(ref)).thenReturn('foo');
  out = iff({type: 'draft article'}, [foo], ref);
  t.is(out, 'foo');

  t.end();
});

tap.test('should invoke all children with ref and concatenate their results', t => {
  var ref = {type: 'article'};
  var foo = td.function();
  var bar = td.function();
  var baz = td.function();

  td.when(foo(ref)).thenReturn('foo');
  td.when(bar(ref)).thenReturn('bar');
  td.when(baz(ref)).thenReturn('baz');

  var iff = ifFn(/* locales */ {}, /* macros */ {}, /* attributes */ {type: 'article'});
  var out = iff([foo, bar, baz], ref);
  t.is(out, 'foobarbaz');
  t.end();
});
