var R = require('ramda');

function applyAffixes(attrs, str) {
  return attrs.prefix + str + attrs.suffix;
}

module.exports = R.curry(function (attrs, str) {
  return R.pipe(
    R.applySpec({
      prefix: R.propOr('', 'prefix'),
      suffix: R.propOr('', 'suffix')
    }),
    R.partialRight(applyAffixes, [str])
  )(attrs);
});