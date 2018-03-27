var R = require('ramda');

var isType = function (ref) {
  return R.equals(R.prop('type', ref));
};

var isNumeric = function (ref) {
  return R.pipe(
    R.prop(R.__, ref),
    R.split(/[,\-&]/),
    R.all(R.pipe(
      R.trim,
      R.test(/^[a-z]*\d+[a-z]*$/i)
    ))
  );
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
      'is-numeric': R.o(R.map(isNumeric(ref)), R.split(' '))
    }, R.omit(['match'], attrs))
  );
}

module.exports = R.curry(function (locales, macros, attrs, children, ref) {
  var results = evaluateConditions(attrs, ref);
  var evaluate = generateEvaluate(attrs);
  return evaluate(results) ? R.into('', R.map(R.applyTo(ref)), children) : '';
});
