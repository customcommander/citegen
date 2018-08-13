var R = require('ramda');

/**
 * Returns a function that checks if a term has a `name` property
 * that is equal to `expectedName`.
 *
 * @example
 * var termNameIsDeveloper = termNameIs('developer');
 * termNameIsDeveloper({name: 'developer', single: 'developer'}); //=> true
 * termNameIsDeveloper({name: 'manager', single: 'manager'}); //=> false
 *
 * @private
 * @function
 * @param {string} expectedName
 * @return {function}
 */
var termNameIs = R.propEq('name');

/**
 * Returns a function that checks if a term has a `form` property
 * that is equal to `expectedForm`.
 *
 * The function also returns `true` if `expectedForm` is set to `'long'`
 * and a term doesn't have a `form` property.
 *
 * @example
 * var termFormIsLong = termFormIs('long');
 * termFormIsLong({name: 'developer', single: 'developer'}); //=> true
 * termFormIsLong({name: 'developer', single: 'developer', form: 'long'}); //=> true
 * termFormIsLong({name: 'developer', single: 'dev', form: 'short'}); //=> false
 *
 * @private
 * @function
 * @param {string} expectedForm
 * @return {function}
 */
var termFormIs = R.pipe(
  R.ifElse(R.equals('long'),
  R.pipe(R.equals, R.either(R.isNil), R.propSatisfies(R.__, 'form')),
  R.propEq('form'))
);

/**
 * Returns a function that checks if a term has a `single` property
 * if `expectedPlural` is set to `'false'`, or has a `multiple` property
 * if `expectedPlural` is set to `'true'`.
 *
 * @example
 * var termHasPlural('true');
 * termHasPlural({name: 'developer', single: 'developer'}); //=> false
 * termHasPlural({name: 'developer', single: 'developer', multiple: 'developers'}); //=> true
 *
 * @private
 * @function
 * @param {string} expectedPlural
 * @return {function}
 */
var termPluralIs = R.ifElse(R.equals('false'),
  R.always(R.has('single')),
  R.always(R.has('multiple')));

/**
 * Returns a function that checks if a term complies with all requirements defined in `attrs`.
 *
 * @example
 * var termPass = generateTermPredicate({term: 'developer', form: 'short', plural: 'true'});
 * termPass({name: 'manager', single: 'manager'}); //=> false
 * termPass({name: 'developer', single: 'dev', form: 'short'}); //=> false
 * termPass({name: 'developer', single: 'dev', multiple: 'devs', form: 'short'}); //=> true
 *
 * @private
 * @function
 * @param {object} attrs
 * @return {function}
 */
var generateTermPredicate = R.converge(
  R.unapply(R.allPass), [
    R.pipe(R.prop('term'), termNameIs),
    R.pipe(R.propOr('long', 'form'), termFormIs),
    R.pipe(R.propOr('false', 'plural'), termPluralIs)
  ]
);

/**
 * Returns a function that will pick either the singular or plural version of a term
 * depending on whether `attrs.plural` is set to `'false'` or `'true'`.
 *
 * @example
 * var pickPlural = pickTermValue({term: 'developer', plural: 'true'});
 * pickPlural({name: 'developer', single: 'developer', multiple: 'developers'}); //=> 'developers'
 *
 * @private
 * @function
 * @param {object} plural
 * @return {function}
 */
var pickTermValue = R.pipe(
  R.propOr('false', 'plural'),
  R.ifElse(R.equals('false'),
    R.always(R.prop('single')),
    R.always(R.prop('multiple')))
);

/**
 * Generates a transducer for finding a term
 * that complies with the requirements described in `attrs`.
 *
 * @private
 * @function
 * @param {object} attrs
 * @return {function}
 */
function generateTransducer (attrs) {
  return R.compose(
    R.map(R.propOr([], 'terms')),
    R.map(R.find(generateTermPredicate(attrs))),
    R.reject(R.isNil),
    R.map(pickTermValue(attrs)),
    R.take(1)
  );
}

/**
 * Finds a term that complies with the requirements described in `attrs`.
 *
 * @function
 * @param {array} locales array of locale objects
 * @param {object} attrs csl text node attributes
 * @return {string}
 */
module.exports = R.flip(R.useWith(
  R.into(''), [
    generateTransducer,
    R.identity
  ]
));
