var td = require('testdouble');
var tap = require('tap');
var citationFn = require('./csl-citation'); // Subject Under Test

var citation = citationFn({} /*locales*/, {} /* macros */, {} /* attributes */);

tap.test('invoke children with `refs`', t => {
  var refs = [];
  var foo = td.function();
  citation([foo], refs);
  td.verify(foo(refs));
  t.end();
});
