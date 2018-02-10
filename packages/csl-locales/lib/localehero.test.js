var tap = require('tap');
var localehero = require('./localehero'); // SUT

tap.test('it should return an empty object', function (t) {
  t.same(localehero(), {});
  t.end();
});
