var R = require('ramda');
var formattingAttr = require('./csl-attr-formatting');
var affixesAttr = require('./csl-attr-affixes');
var delimiterAttr = require('./csl-attr-delimiter');

/**
 * Reducing function
 * @function
 */
var layoutIterator = R.useWith(R.concat, [
  R.identity,
  R.ifElse(R.isEmpty, R.always([]), R.of)
]);

module.exports = R.curry(function (locales, macros, attrs, children, refs) {
  var transducer = R.compose(R.map(R.of), R.map(R.ap(children)), R.map(R.join('')));
  return R.pipe(
    R.transduce(transducer, layoutIterator, []),
    delimiterAttr(attrs),
    formattingAttr(attrs),
    affixesAttr(attrs)
  )(refs);
});
