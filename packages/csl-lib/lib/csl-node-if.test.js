const tap = require('tap');
const td = require('testdouble');
const {gen, sampleOne} = require('testcheck');
const genNumber = require('./generators/number');
const ifFn = require('./csl-node-if'); // Subject Under Test

tap.test('support the `type` attribute', t => {
  const iff = ifFn(/* locales */ {}, /* macros */ {});
  const ref = {type: 'article'};
  const fn = td.function();

  td.when(fn(ref)).thenReturn('🌯');

  t.is(iff({type: 'xxx'}, [fn, fn], ref), '',
    'return empty string when given type does not match');

  t.is(iff({type: 'article'}, [fn, fn], ref), '🌯🌯',
    'apply children if given type matches reference type');

  t.is(iff({type: 'xxx yyy article zzz', match: 'any'}, [fn, fn], ref), '🌯🌯',
    'apply children if any of the given types match reference type');

  t.is(iff({type: 'xxx yyy zzz', match: 'none'}, [fn, fn], ref), '🌯🌯',
    'apply children if none of the given type match reference type');

  t.end();
});

tap.test('support the `is-numeric` attribute', t => {
  const iff = ifFn(/* locales*/{}, /* macros */ {});
  const ref = sampleOne(gen.object({volume: genNumber}));
  const fn = td.function();

  td.when(fn(ref)).thenReturn('ok');

  t.is(iff({'is-numeric': 'volume'}, [fn, fn], ref), 'okok',
    'apply children if field is numeric');

  t.end();
});
