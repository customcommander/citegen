const tap = require('tap');
const affixes = require('./affixes'); // Subject Under Test

tap.equal(affixes({}, 'aaa'), 'aaa',
  'default affixes are empty strings');

tap.equal(affixes({prefix: '(', suffix: ')'}, 'aaa'), '(aaa)',
  'apply affixes on non-empty string');

tap.equal(affixes({prefix: '(', suffix: ')'}, ''), '',
  'does not apply affixes on empty string');
