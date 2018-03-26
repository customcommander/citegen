const tap = require('tap');
const affixes = require('./csl-attr-affixes'); // Subject Under Test

tap.equal(affixes(null, '123'), '123',
  'return value as is if `attrs` is not an object.');

tap.equal(affixes({}, '123'), '123',
  'return value as is if `attrs` does not include affixes attributes.');

tap.equal(affixes({prefix: '('}, '123'), '(123',
  'prepend `prefix` to value.');

tap.equal(affixes({suffix: ')'}, '123'), '123)',
  'append `suffix` to value.');

tap.equal(affixes({prefix: '(', suffix: ')'}, '123'), '(123)',
  'wrap value with `prefix` and `suffix` when both are provided.');
