/**
 * @license
 * Copyright (c) 2018 Julien Gonzalez
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
  allPass,
  compose,
  concat,
  cond,
  curry,
  either,
  equals,
  filter,
  has,
  identity,
  ifElse,
  is,
  isEmpty,
  juxt,
  lensProp,
  map,
  merge,
  of,
  pipe,
  prop,
  propEq,
  propOr,
  propSatisfies,
  reject,
  set,
  T,
  take,
  test,
  transduce
} = require('ramda');

const form = propOr('long', 'form');
const term = prop('term');
const plural = propOr('false', 'plural');
const matchFunction = ifElse(is(RegExp), test, equals);

/**
 * Checks that given `term` has a name property equals to `termName`.
 * @param {string} expected
 * @param {term} term
 * @return {boolean}
 */
const nameIs = curry((expected, term) =>
  propSatisfies(matchFunction(expected), 'name', term));

/**
 * Checks that given `term` has a form property equals to `termForm`.
 * @param {string} expected
 * @param {term} term
 * @return {boolean}
 */
const formIs = curry((expected, term) =>
  expected === form(term));

/**
 * Checks that given `term` exposes a singular or plural form.
 * @param {string} expected
 * @param {term} term
 * @return {boolean}
 */
const pluralIs = curry((expected, term) =>
  has((expected === 'false' ? 'single' : 'multiple'), term));

/**
 * Takes a set of attributes `attrs` and creates a function
 * that takes a term as its sole parameter and returns true
 * if it satisfies all attributes.
 *
 * @param {object} attrs
 * @param {string} attrs.term term's name
 * @param {string} [attrs.form='long'] term's form
 * @param {string} [attrs.plural='false'] singular or plural version of the form?
 * @return {function}
 */
const predicate = (attrs) =>
  allPass([
    nameIs(term(attrs)),
    formIs(form(attrs)),
    pluralIs(plural(attrs))]);

/**
 * Finds a term in a given list of locales `locales`
 * that satisfies the attributes `attrs`.
 *
 * @param {locale[]} locales
 * @param {function} validate
 * @param {object} attrs
 * @return {string}
 */
const findTerm = curry((locales, validate, attrs) =>
  transduce(
    compose(
      map(propOr([], 'terms')),
      map(filter(predicate(attrs))),
      map(filter(validate)),
      reject(isEmpty),
      take(1)),
    concat,
    [],
    locales));

/**
 * Sets the form property of a given object to a given value.
 *
 * @example
 * setForm('short', {term: 'foo', form: 'long'});
 * //=> {term: 'foo', form: 'short'}
 *
 * @param {string} form
 * @param {object} obj
 * @return {object} A similar object but with an updated form property
 */
const setForm = set(lensProp('form'));

/**
 * Implements the form fallback mechanism as described here:
 * http://docs.citationstyles.org/en/1.0.1/specification.html#terms
 *
 * @param {object} attrs
 * @return {object[]} Array of attributes
 */
const withFallback =
  pipe(
    merge({form: 'long', plural: 'false'}),
    cond([
      [propEq('form', 'symbol'),
        juxt([identity, setForm('short'), setForm('long')])],
      [propEq('form', 'verb-short'),
        juxt([identity, setForm('verb'), setForm('long')])],
      [either(propEq('form', 'verb'), propEq('form', 'short')),
        juxt([identity, setForm('long')])],
      [T, of]]));

/**
 * Finds a term in given list of locales `locales`, that satisfies
 * given attributes `attrs` and returns its value.
 *
 * The function stops as soon as a matching term has been located
 * in the list. (The list of locales is assumed to be arranged
 * in increasing priority order.)
 *
 * If a term can't be found in a particular form,
 * the function tries to find a similar term in another form.
 *
 * The fallback of forms is best described here:
 * http://docs.citationstyles.org/en/1.0.1/specification.html#terms
 *
 * If a term cannot be found at all, an empty string is returned.
 *
 * @example
 * var locales = [
 *  {terms: [
 *    {name: 'foo',
 *     form: 'long',
 *     single: 'foo_long_singular',
 *     multiple: 'foo_long_plural'},
 *    {name: 'foo',
 *     form: 'short',
 *     single: 'foo_short_singular',
 *     multiple: 'foo_short_plural'},
 *  ]},
 *  {terms: [
 *    {name: 'foo',
 *     form: 'verb',
 *     single: 'do_foo_singular',
 *     multiple: 'do_foo_plural'}
 *  ]}
 * ];
 *
 * findTerm({term: 'foo'}, locales); //=> 'foo_long_singular'
 * findTerm({term: 'foo', plural: 'true'}, locales); //=> 'foo_long_plural'
 * findTerm({term: 'foo', form: 'short', plural: 'true'}, locales); //=> 'foo_short_plural'
 *
 * @module {function} l10n/find-term
 * @param {object} attrs
 * @param {function} validate
 * @param {locale[]} locales
 * @return {string}
 */
module.exports = curry((attrs, validate, locales) =>
  transduce(
    compose(
      map(findTerm(locales, validate)),
      reject(isEmpty),
      take(1)),
    concat,
    [],
    withFallback(attrs)));
