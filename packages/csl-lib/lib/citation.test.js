const td = require('testdouble');
const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('./output');
const sut = require('./citation'); // Subject Under Test

const citation = compose(toString, sut([{}], {}, {}));
const out = output({}, 'a-node');

tap.test('invoke children with `refs`', t => {
  const refs = [{},{},{}];
  const foo = td.function();
  td.when(foo(refs)).thenReturn(out('foo bar baz'));
  t.is(citation([foo], refs), 'foo bar baz');
  t.end();
});
