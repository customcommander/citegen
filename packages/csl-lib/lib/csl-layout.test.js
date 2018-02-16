var td = require('testdouble');
var tap = require('tap');
var constants = require('./constants');
var assertChildren = td.replace('./assert-children', td.function());
var layout = require('./csl-layout'); // Subject Under Test

tap.test('layout(children): should validate its children', t => {
  layout([]);
  td.verify(assertChildren([], [constants.CSL_NODE_TEXT]));
  t.end();
});

tap.type(layout(), 'function', 'layout(children): should return a function');

tap.test('layout(children)(refs): should invoke each item in `children` for each item in `refs`', t => {
  var foo = td.function();
  var bar = td.function();

  layout([foo, bar])(['🌯', '🍺']);

  td.verify(foo('🌯'));
  td.verify(foo('🍺'));

  td.verify(bar('🌯'));
  td.verify(bar('🍺'));

  t.end();
});

tap.test('layout(children)(refs): should ignore empty strings returned by children', t => {
  var foo = td.function();
  var bar = td.function();

  td.when(foo('🐥')).thenReturn('🍗');
  td.when(foo('💩')).thenReturn('');

  td.when(bar('🐥')).thenReturn('🍔');
  td.when(bar('💩')).thenReturn('');

  var out = layout([foo, bar])(['🐥', '💩']);
  t.is(out, '🍗🍔');

  t.end();
});

tap.test('layout(children, opts)(refs): should support affixes attributes', t => {
  var out;
  var foo = td.function();

  td.when(foo(1)).thenReturn('🍺');

  out = layout([foo])([1]);
  t.is(out, '🍺', 'default affixes should be empty strings');

  out = layout([foo], {prefix: '🎉'})([1]);
  t.is(out, '🎉🍺', 'should be able to render a `prefix` attribute');

  out = layout([foo], {suffix: '🎉'})([1]);
  t.is(out, '🍺🎉', 'should be able to render a `suffix` attribute');

  out = layout([foo], {prefix: '🎉', suffix: '🎉'})([1]);
  t.is(out, '🎉🍺🎉', 'should be able to render both `prefix` and `suffix` attributes');

  t.end();
});

tap.test('layout(children, opts)(refs): should support a delimiter attribute', t => {
  var out;
  var foo = td.function();
  var bar = td.function();

  td.when(foo(1)).thenReturn('🍺');
  td.when(bar(1)).thenReturn('🎉');

  out = layout([foo, bar])([1, 1]);
  t.is(out, '🍺🎉🍺🎉', 'default delimiter should be an empty string');

  out = layout([foo, bar], {delimiter: '🌯'})([1, 1]);
  t.is(out, '🍺🎉🌯🍺🎉', 'should be able to render a delimiter attribute');

  t.end();
});

td.reset();
