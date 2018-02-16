var tap = require('tap');
var citation = require('./csl-citation');

tap.test('it should return a citation', t => {
  t.is(citation({}, {}), 'this is a citationx');
  t.end();
});

tap.test('it should throw if there are no locales', t => {
  t.throws(() => citation({}));
  t.end();
});
