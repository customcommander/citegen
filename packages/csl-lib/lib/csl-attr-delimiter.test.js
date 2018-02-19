var tap = require('tap');
var delimiter = require('./csl-attr-delimiter');

tap.equal(delimiter(null, [1,2,3]), '123',
  'default `delimiter` is an empty string');

tap.equal(delimiter({delimiter: '-'}, [1,2,3]), '1-2-3',
  'join items in `arr` with `delimiter`');
