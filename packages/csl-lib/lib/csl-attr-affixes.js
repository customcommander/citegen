var R = require('ramda');

function applyAffixes(attrs, str) {
  return attrs.prefix + str + attrs.suffix;
}

module.exports = R.curry(function (attrs, str) {
  var affixes = R.applySpec({
    prefix: R.propOr('', 'prefix'),
    suffix: R.propOr('', 'suffix')
  })(attrs);
  return applyAffixes(affixes, str);
});
