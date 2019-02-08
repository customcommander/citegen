/**
 * @license
 * Copyright (c) 2019 Julien Gonzalez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const {
  all,
  always,
  any,
  applyTo,
  call,
  compose,
  cond,
  converge,
  curry,
  curryN,
  equals,
  evolve,
  flip,
  identity,
  join,
  map,
  none,
  omit,
  propEq,
  propOr,
  split,
  T,
  useWith,
  values
} = require('ramda');

const {isNumeric} = require('./utils/number');
const {isApproximate} = require('./utils/date');

const isTrue = equals(true);

/**
 * Applies given predicate to each value in a space-separated-values string,
 * and collects the result into an array.
 *
 * @example
 * check(equals('foo'), 'foo bar foo');
 * //=> [true, false, true]
 *
 * @function
 * @param {function} predicate
 * @param {string} values
 * @return {boolean}
 */
const check = useWith(map, [identity, split(' ')]);

/**
 * Checks that `ref.type` is set to given `type`.
 *
 * @example
 * checkType({type: 'journal'}, 'journal');
 * //=> true
 * checkType({type: 'journal'}, 'book');
 * //=> false
 *
 * @function
 * @param {object} ref
 * @param {string} type
 * @return {boolean}
 */
const checkType = flip(propEq('type'));

/**
 * Checks that given `key` in `ref` holds valid numeric content.
 *
 * @example
 * checkNumeric({edition: '2nd'}, 'edition');
 * //=> true
 * checkNumeric({edition: 'foo bar'}, 'edition');
 * //=> false
 *
 * @function
 * @param {object} ref
 * @param {string} key A key in ref
 * @see {@link https://docs.citationstyles.org/en/master/specification.html#choose}
 *  for how to check if something is numeric
 */
const checkNumeric = curryN(2, compose(isNumeric, flip(propOr(''))));

/**
 * Checks that a `ref[dateVarName]` contains an approximate date.
 *
 * @example
 * checkApproximateDate({issued: {circa: 1}}, 'issued');
 * //=> true
 *
 * @function
 * @param {object} ref
 * @param {string} dateVarName
 * @return {boolean}
 * @see {@link https://docs.citationstyles.org/en/master/specification.html#approximate-dates}
 * @see {@link https://github.com/citation-style-language/documentation/issues/61}
 */
const checkApproximateDate = curryN(2, compose(isApproximate, flip(propOr(''))));

/**
 * @function
 * @param {object} attrs
 * @return {function}
 */
const evaluateFunction = cond([
  [propEq('match', 'any'),
    always(any(any(isTrue)))],
  [propEq('match', 'none'),
    always(all(none(isTrue)))],
  [T,
    always(all(all(isTrue)))]]);

/**
 * Removes any non-constraint keys from `attrs`.
 *
 * @function
 * @param {object} attrs
 * @return {object}
 */
const pickConstraints = omit(['match']);

/**
 * Returns an object of predicates
 * @function
 * @param {object} ref
 * @return {object}
 */
const buildConstraints = ref => ({
  'type': check(checkType(ref)),
  'is-numeric': check(checkNumeric(ref)),
  'is-uncertain-date': check(checkApproximateDate(ref))
});

/**
 * @function
 * @param {object} attrs
 * @param {object} ref
 * @return {boolean[][]}
 */
const evaluateConstraints = useWith(
  compose(values, flip(evolve)), [
    pickConstraints,
    buildConstraints]);

const evaluate = converge(call, [evaluateFunction, evaluateConstraints]);

/**
 * @function
 * @param {locale[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object}
 */
module.exports = curry((locales, macros, attrs, children, ref) =>
  evaluate(attrs, ref) ? join('', map(applyTo(ref), children)) : '');
