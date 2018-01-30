var test = require('tape');
var citation = require('./csl-citation');

test('it should return a citation', t => {
  t.is(citation({}, {}), 'this is a citation');
  t.end();
});
