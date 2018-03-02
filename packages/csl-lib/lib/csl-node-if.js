var R = require('ramda');

var isType = R.curry(function (types, ref) {
  var thisType = R.equals(R.prop('type', ref));
  return R.any(thisType, types);
});

/**
 * @function
 * @param {object} attrs - CSL Node Attributes
 * @return {function[]}
 */
var generateConditions = R.compose(R.values, R.evolve({
  type: R.compose(isType, R.split(' '))
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
