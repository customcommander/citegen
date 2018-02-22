var R = require('ramda');

var getL10nTermKey = R.always('name');
var getL10nFormKey = R.always('form');
var getL10nPluralKey = R.pipe(
  R.prop('plural'),
  R.ifElse(
    R.equals('true'),
    R.always('multiple'),
    R.always('single')
  )
);

var filterTerm = function (attrs) {
  return R.where(
    R.converge(R.unapply(R.fromPairs), [
      R.converge(R.pair, [getL10nTermKey, R.compose(R.equals, R.prop('term'))]),
      R.converge(R.pair, [getL10nFormKey, R.compose(R.equals, R.prop('form'))]),
      R.converge(R.pair, [getL10nPluralKey, R.always(R.is(String))])
    ])(attrs)
  );
}

module.exports = R.curry(function (locales, attrs) {
  return R.pipe(
    R.path(['terms', R.prop('term', attrs)]),
    R.ifElse(R.isNil, R.always(''), R.pipe(
      R.find(filterTerm(attrs)),
      R.propOr('', getL10nPluralKey(attrs))
    ))
  )(locales);
});
