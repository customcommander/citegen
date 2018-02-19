var tap = require('tap');
var affixes = require('./csl-attr-affixes'); // Subject Under Test

tap.equal(affixes(null, 'foo'), 'foo',
  'default affixes are empty strings');

tap.equal(affixes({prefix: '('}, 'foo'), '(foo', 
  'render `prefix` before `str`');

tap.equal(affixes({suffix: ')'}, 'foo'), 'foo)',
  'render `suffix` after `str`');

tap.equal(affixes({prefix: '(', suffix: ')'}, 'foo'), '(foo)',
  'wrap `str` with affixes if both are provided');
