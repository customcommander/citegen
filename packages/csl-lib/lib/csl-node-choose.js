var R = require('ramda');

/**
 * Used as a reduce iterator.
 * Iterates until a function returns a non-empty string.
 * @function
 * @param {string} acc - The accumulated value.
 * @param {any} value - The returned value of the function
 * @return {string}
 */
var chooseIterator = R.pipe(
  R.concat,
  R.unless(R.isEmpty, R.reduced)
);

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var transducer = R.map(R.applyTo(ref));
  return R.transduce(transducer, chooseIterator, '', children);
});
