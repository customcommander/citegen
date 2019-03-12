const tap = require('tap');
const {toString} = require('ramda');
const output = require('../output');
const delimiter = require('./delimiter'); // SUT

tap.test('includes a delimiter character in the output', t => {
  t.plan(1);

  const DELIM = ',';
  const attrs = {delimiter: DELIM};

  const out = output({}, 'parent-node', [
    output({}, 'child-node-1', 'foo'),
    output({}, 'child-node-2', 'bar'),
    output({}, 'child-node-3', 'baz'),
  ]);

  t.equals(toString(delimiter(attrs, out)), `foo${DELIM}bar${DELIM}baz`);

  t.end();
});
