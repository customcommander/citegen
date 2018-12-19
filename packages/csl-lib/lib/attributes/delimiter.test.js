const tap = require('tap');
const delimiter = require('./delimiter');

tap.equal(delimiter(null, [1,2,3]), '123',
  'join values with an empty string if `attrs` is not an object.');

tap.equal(delimiter({}, [1,2,3]), '123',
  'join values with an empty string if `attrs` does not include a delimiter attribute.');

tap.equal(delimiter({delimiter: []}, [1,2,3]), '123',
  'join values with an empty string if `attrs.delimiter` is not a string.');

tap.equal(delimiter({delimiter: '-'}, [1,2,3]), '1-2-3',
  'join values with given `attrs.delimiter` if it is a string.');
