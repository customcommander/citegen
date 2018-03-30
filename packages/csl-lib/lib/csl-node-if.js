var R = require('ramda');
var isNumeric = require('./csl-util-is-numeric');

var isType = function (ref) {
  return R.equals(R.prop('type', ref));
};

var generateEvaluate = function (attrs) {
  var isTrue = R.equals(true);
  return R.cond([
    [R.propEq('match', 'any'), R.always(R.any(R.any(isTrue)))],
    [R.propEq('match', 'none'), R.always(R.all(R.none(isTrue)))],
    [R.T, R.always(R.all(R.all(isTrue)))]
  ])(attrs);
};

var evaluateConditions = function (attrs, ref) {
  return R.values(
    R.evolve({
      'type': R.o(R.map(isType(ref)), R.split(' ')),
      'is-numeric': R.o(R.map(R.pipe(R.prop(R.__, ref), isNumeric)), R.split(' '))
    }, R.omit(['match'], attrs))
  );
}

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var results = evaluateConditions(attrs, ref);
  var evaluate = generateEvaluate(attrs);
  return evaluate(results) ? R.into('', R.map(R.applyTo(ref)), children) : '';
});
