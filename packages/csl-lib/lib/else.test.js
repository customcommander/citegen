const td = require('testdouble');
const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('./output');
const sut = require('./else');

tap.test('<else>: applies given reference to enclosed style', t => {
  const ref = {};

  const foo = td.function();
  const bar = td.function();
  td.when(foo(ref)).thenReturn(output({}, 'a-node', 'foo'));
  td.when(bar(ref)).thenReturn(output({}, 'another-node', 'bar'));

  const elseFn = compose(toString, sut({}, {}, {}));

  t.equals(elseFn([foo, bar], ref), 'foobar');
  t.end();
});
