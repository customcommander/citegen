var R = require('ramda');

function text(attrs, ref) {
  return R.prop('value', attrs);
}

module.exports = R.curry(function (attrs, children, ref) {
  return text(attrs, ref);
});