var R = require('ramda');

var isType = R.curry(function (types, ref) {
  var thisType = R.equals(R.prop('type', ref));
  return R.any(thisType, types);
});

var isNumeric = R.curry(function (vars, ref) {
  return R.any(R.pipe(
    R.prop(R.__, ref),
    R.split(/[,\-&]/),
    R.all(R.pipe(R.trim, R.test(/^[a-z]*\d+[a-z]*$/i)))
  ), vars);
});

/**
 * @function
 * @param {object} attrs - CSL Node Attributes
 * @return {function[]}
 */
var generateConditions = R.compose(R.values, R.evolve({
  type: R.compose(isType, R.split(' ')),
  'is-numeric': R.compose(isNumeric, R.split(' '))
}));

var generateEvaluate = function (attrs) {
  return R.cond([
    [R.propEq('match', 'any'), R.always(R.any)],
    [R.propEq('match', 'none'), R.always(R.none)],
    [R.T, R.always(R.all)]
  ])(attrs)(R.equals(true));
};

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var conditions = generateConditions(attrs);
  var evaluate = generateEvaluate(attrs);
  return evaluate(R.juxt(conditions)(ref)) ? R.into('', R.map(R.applyTo(ref)), children) : '';
});
