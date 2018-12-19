const R = require('ramda');
const tap = require('tap');
const displayAttr = require('./display'); // Subject Under Test

const displayFoo = displayAttr(R.__, 'foo');

tap.is('<div class="csl-display-line">foo</div>', displayFoo({display: 'block'}),
  'supports display="block" attribute.');

tap.is('<div class="csl-display-col1">foo</div>', displayFoo({display: 'left-margin'}),
  'supports display="left-margin" attribute.');

tap.is('<div class="csl-display-col2">foo</div>', displayFoo({display: 'right-inline'}),
  'supports display="right-inline" attribute.');

tap.is('<div class="csl-display-indent">foo</div>', displayFoo({display: 'indent'}),
  'supports display="indent" attribute.');

tap.is('foo', displayFoo({display: 'unknown'}),
  'returns string as is if attribute value is not valid.');

tap.is('foo', displayFoo({}),
  'returns string as is if display attribute is not provided.');
