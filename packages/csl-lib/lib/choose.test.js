const tap = require('tap');
const {compose, toString} = require('ramda');
const td = require('testdouble');
const output = require('./output');
const sut = require('./choose'); // Subject Under Test

const out = output({}, 'a-node');
const choose = compose(toString, sut([{}], {}, {}));

tap.test('should invoke children until one returns a non-empty string', t => {
  const ref = {};
  const fn1 = td.function();
  const fn2 = td.function();
  const fn3 = td.function();

  td.when(fn1(ref)).thenReturn(out(''));
  td.when(fn2(ref)).thenReturn(out('foo'));
  td.when(fn3(ref)).thenReturn(out('bar'));

  t.is(choose([fn1, fn2, fn3], ref), 'foo');
  t.end();
});
