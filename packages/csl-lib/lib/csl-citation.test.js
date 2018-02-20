var td = require('testdouble');
var tap = require('tap');
var citation = require('./csl-citation'); // Subject Under Test

tap.test('invoke children with `refs`', t => {
  var refs = [];
  var child = td.function();
  citation(refs, [child]);
  td.verify(child(refs));
  t.end();
});
