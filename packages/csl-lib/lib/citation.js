var R = require('ramda');

module.exports = R.curry(function (locales, macros, attrs, children, refs) {
  return children[0](refs);
});
