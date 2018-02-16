var td = require('testdouble');
var tap = require('tap');
var constants = require('./constants');
var assertChildren = td.replace('./assert-children', td.function());
var citation = require('./csl-citation'); // Subject Under Test

tap.test('validates its children', t => {
  var children = [td.function()];
  citation([], children);
  td.verify(assertChildren(children, [constants.CSL_NODE_LAYOUT]));
  t.end();
});

tap.test('invoke children with `refs`', t => {
  var refs = [];
  var child = td.function();
  citation(refs, [child]);
  td.verify(child(refs));
  t.end();
});

td.reset();
