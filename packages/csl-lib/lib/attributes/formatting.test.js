var tap = require('tap');
var formatting = require('./formatting'); // Subject Under Test

tap.equal(formatting({}, 'foo'), 'foo',
  'return `str` as is if there are no formatting attributes');

tap.equal(formatting({'font-style': 'italic'}, ''), '',
  'return `str` as is if empty ');

tap.equal(formatting({'font-style':'italic'}, 'foo'), '<span style="font-style:italic">foo</span>',
  'support the following formatting attribute: `font-style`');

tap.equal(formatting({'font-variant':'small-caps'}, 'foo'), '<span style="font-variant:small-caps">foo</span>',
  'support the following formatting attribute: `font-variant`');

tap.equal(formatting({'font-weight':'bold'}, 'foo'), '<span style="font-weight:bold">foo</span>',
  'support the following formatting attribute: `font-weight`');

tap.equal(formatting({'text-decoration':'underline'}, 'foo'), '<span style="text-decoration:underline">foo</span>',
  'support the following formatting attribute: `text-decoration`');

tap.equal(formatting({'vertical-align':'sup'}, 'foo'), '<span style="vertical-align:sup">foo</span>',
  'support the following formatting attribute: `vertical-align`');

tap.equal(formatting({'font-style':'italic','font-weight':'bold'}, 'foo'), '<span style="font-style:italic;font-weight:bold">foo</span>',
  'support multiple formatting attributes');
