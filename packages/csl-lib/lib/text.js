var R = require('ramda');
var l10nText = require('./l10n/find-term-text');
var displayAttr = require('./attributes/display');
var textCaseAttr = require('./attributes/text-case');
var stripPeriodsAttr = require('./attributes/strip-periods');

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

var attributes = R.converge(
  R.pipe, [
    R.unary(stripPeriodsAttr),
    R.unary(textCaseAttr),
    R.unary(displayAttr)]);

/**
 * @param {object[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 */
module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var content = R.cond([
    [R.has('term'), (attrs) => getTerm('long', false, attrs.term, locales)],
    [R.has('variable'), getVariable(ref)],
    [R.has('macro'), runMacro(macros, ref)],
    [R.has('value'), getValue],
    [R.T, getEmptyString]
  ])(attrs);

  return attributes(attrs)(content);
});
