var R = require('ramda');
var formattingAttr = require('./csl-attr-formatting');
var affixesAttr = require('./csl-attr-affixes');
var delimiterAttr = require('./csl-attr-delimiter');

module.exports = R.curry(function (locales, macros, attrs, children, refs) {
  return R.pipe(
    R.map(R.pipe(R.of, R.ap(children), R.join(''))),
    R.filter(R.complement(R.isEmpty)),
    delimiterAttr(attrs),
    formattingAttr(attrs),
    affixesAttr(attrs)
  )(refs);
});
