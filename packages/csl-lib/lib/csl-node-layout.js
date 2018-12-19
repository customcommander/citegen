var R = require('ramda');
var formattingAttr = require('./attributes/formatting');
var affixesAttr = require('./attributes/affixes');
var delimiterAttr = require('./attributes/delimiter');

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
