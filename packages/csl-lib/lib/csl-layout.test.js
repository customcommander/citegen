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

  layout([foo, bar])(['1', '2']);

  td.verify(foo('1'));
  td.verify(foo('2'));

  td.verify(bar('1'));
  td.verify(bar('2'));

  t.end();
});

tap.test('layout(children)(refs): should ignore empty strings returned by children', t => {
  var foo = td.function();
  var bar = td.function();

  td.when(foo('1')).thenReturn('10');
  td.when(foo('2')).thenReturn('');

  td.when(bar('1')).thenReturn('11');
  td.when(bar('2')).thenReturn('');

  var out = layout([foo, bar])(['1', '2']);
  t.is(out, '1011');

  t.end();
});

tap.test('layout(children, opts)(refs): should support affixes attributes', t => {
  var out;
  var foo = td.function();

  td.when(foo(1)).thenReturn('10');

  out = layout([foo])([1]);
  t.is(out, '10', 'default affixes should be empty strings');

  out = layout([foo], {prefix: '('})([1]);
  t.is(out, '(10', 'should be able to render a `prefix` attribute');

  out = layout([foo], {suffix: ')'})([1]);
  t.is(out, '10)', 'should be able to render a `suffix` attribute');

  out = layout([foo], {prefix: '(', suffix: ')'})([1]);
  t.is(out, '(10)', 'should be able to render both `prefix` and `suffix` attributes');

  t.end();
});

tap.test('layout(children, opts)(refs): should support a delimiter attribute', t => {
  var out;
  var foo = td.function();
  var bar = td.function();

  td.when(foo(1)).thenReturn('10');
  td.when(bar(1)).thenReturn('11');

  out = layout([foo, bar])([1, 1]);
  t.is(out, '10111011', 'default delimiter should be an empty string');

  out = layout([foo, bar], {delimiter: '/'})([1, 1]);
  t.is(out, '1011/1011', 'should be able to render a delimiter attribute');

  t.end();
});

td.reset();
