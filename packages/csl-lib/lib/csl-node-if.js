var R = require('ramda');

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  return R.transduce(R.map(R.applyTo(ref)), R.concat, '', children);
});
