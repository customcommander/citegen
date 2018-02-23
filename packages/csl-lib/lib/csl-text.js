var R = require('ramda');
var l10nText = require('./csl-l10n-text');

var getEmptyString = R.always('');
var getTerm = l10nText;
var getValue = R.prop('value');

var getVariable = R.curry(function (ref, attrs) {
  return R.pipe(
    R.prop('variable'),
    R.prop(R.__, ref)
  )(attrs);
});

var runMacro = R.curry(function (macros, ref, attrs) {
  return R.pipe(
    R.prop('macro'),
    R.propOr(getEmptyString, R.__, macros),
    R.applyTo(ref)
  )(attrs);
});

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var content = R.cond([
    [R.has('term'), getTerm(locales)],
    [R.has('variable'), getVariable(ref)],
    [R.has('macro'), runMacro(macros, ref)],
    [R.has('value'), getValue],
    [R.T, getEmptyString]
  ])(attrs);

  return content;
});
