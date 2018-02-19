var R = require('ramda');

module.exports = R.curry(function (attrs, arr) {
  return R.pipe(
    R.propOr('', 'delimiter'),
    R.join,
    R.applyTo(arr)
  )(attrs);
});
