var tap = require('tap');
var td = require('testdouble');
var {check, gen, property} = require('testcheck');
var genNumber = require('./testcheck-generators/number');
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

tap.test('shoud support the "is-numeric" attribute', t => {
  const iff = ifFn(/* locales*/{}, /* macros */ {});

  const child = td.function();
  td.when(child(td.matchers.anything())).thenReturn('ok');

  const applyChildrenWhenFieldIsNumeric = property({'is-numeric': 'volume'}, [child, child], gen.object({volume: genNumber}),
    (attrs, children, ref) => iff(attrs, children, ref) === 'okok'
  );

  const propCheck = check(applyChildrenWhenFieldIsNumeric);
  t.is(propCheck.result, true, 'apply children if field is numeric');
  t.end();
});
