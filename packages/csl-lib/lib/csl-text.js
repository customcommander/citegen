var R = require('ramda');

module.exports = R.curry(function (locales, attrs, children, ref) {
  return R.prop('value', attrs);
});