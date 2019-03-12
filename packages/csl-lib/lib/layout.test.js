const td = require('testdouble');
const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('./output');
const o = output({}, 'a-node');
const sut = require('./layout'); // Subject Under Test

tap.test('layout: apply each reference and ignore empty children output', t => {
  const x = td.function();
  const y = td.function();
  const layout = compose(toString, sut(/*locales*/[{}], /*macros*/{}, /*attrs*/{}));

  td.when(x('1')).thenReturn(o('10'));
  td.when(x('2')).thenReturn(o(''));
  td.when(x('3')).thenReturn(o('30'));

  td.when(y('1')).thenReturn(o('11'));
  td.when(y('2')).thenReturn(o(''));
  td.when(y('3')).thenReturn(o('33'));

  t.is(layout([x, y], ['1', '2', '3']), '10113033');

  t.end();
});

tap.test('layout(children, opts)(refs): should support affixes attributes', t => {
  const x = td.function();
  const layout = compose(toString, sut(/*locales*/[{}], /*macros*/{}));

  td.when(x(1)).thenReturn(o('10'));

  t.is(layout({}, [x], [1]), '10', 'default affixes should be empty strings');
  t.is(layout({prefix: '(', suffix: ')'}, [x], [1]), '(10)', 'should be able to render both `prefix` and `suffix` attributes');

  t.end();
});

tap.test('layout(children, opts)(refs): should support a delimiter attribute', t => {
  const x = td.function();
  const y = td.function();
  const layout = compose(toString, sut(/*locales*/[], /*macros*/{}));

  td.when(x(1)).thenReturn(o('10'));
  td.when(y(1)).thenReturn(o('11'));

  t.is(layout({}, [x, y], [1, 1]), '10111011', 'default delimiter should be an empty string');
  t.is(layout({delimiter: '/'}, [x, y], [1, 1]), '1011/1011', 'should be able to render a delimiter attribute');

  t.end();
});
