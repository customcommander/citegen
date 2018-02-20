var R = require('ramda');
var formattingAttr = require('./csl-attr-formatting');
var affixesAttr = require('./csl-attr-affixes');
var delimiterAttr = require('./csl-attr-delimiter');

function layout(attrs, children, refs) {
  return R.pipe(
    R.map(R.of),
    R.map(R.ap(children)),
    R.map(R.join('')),
    R.filter(R.complement(R.isEmpty)),
    delimiterAttr(attrs),
    formattingAttr(attrs),
    affixesAttr(attrs)
  )(refs);
};

module.exports = function (children, attrs) {
  return layout.bind(null, attrs || {}, children);
};
