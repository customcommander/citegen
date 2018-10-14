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
/**
 * @file Finds a term in a list of locales.
 * @author Julien Gonzalez <hello@spinjs.com>
 */

var R = require('ramda');

/**
 * Takes a set of attributes `attrs` and creates a function
 * that takes a term as its sole parameter and returns true
 * if it satisfies all attributes.
 *
 * @function
 * @param {object} attrs
 * @param {string} attrs.term term's name
 * @param {string} [attrs.form='long'] term's form
 * @param {string} [attrs.plural='false'] singular or plural version of the form?
 * @return {function}
 */
var generatePredicate =
  R.converge(
    R.unapply(R.allPass), [
      R.unary(
        R.useWith(R.equals, [
          R.prop('term'),
          R.prop('name')])),
      R.unary(
        R.useWith(R.equals, [
          R.prop('form'),
          R.propOr('long', 'form')])),
      R.unary(
        R.useWith(R.has, [
          R.ifElse(R.propEq('plural', 'false'),
            R.always('single'),
            R.always('multiple')),
          R.identity]))]);

/**
 * Returns a function to extract the value of a term
 * depending on the plural attribute.
 *
 * @example
 * var value = extractValue({plural: 'true'});
 * value({single: 'foo', multiple: 'bar'}); //=> 'bar'
 *
 * @function
 * @param {object} attrs
 * @return {function}
 */
var extractValue =
  R.ifElse(R.propEq('plural', 'false'),
    R.always(R.prop('single')),
    R.always(R.prop('multiple')));

/**
 * Finds a term in a given list of locales `locales`
 * that satisfies the attributes `attrs`.
 *
 * @function
 * @param {object} attrs
 * @param {locale[]} locales
 * @return {string}
 */
var findTerm = R.curry(function (attrs, locales) {
  return R.into('',
    R.compose(
      R.map(R.propOr([], 'terms')),
      R.map(R.filter(generatePredicate(attrs))),
      R.reject(R.isEmpty),
      R.map(R.head),
      R.map(extractValue(attrs)),
      R.take(1)),
    locales);
});

/**
 * Sets the form property of a given object to a given value.
 *
 * @example
 * setForm('short', {term: 'foo', form: 'long'});
 * //=> {term: 'foo', form: 'short'}
 *
 * @function
 * @param {string} form
 * @param {object} obj
 * @return {object} A similar object but with an updated form property
 */
var setForm = R.set(R.lensProp('form'));

/**
 * Merges defaults into given attributes.
 *
 * @example
 * withDefault({term: 'foo'});
 * //=> {term: 'foo', form: 'long', plural: 'false'}
 *
 * @function
 * @param {object} attrs
 * @return {object} The same attributes with default values.
 */
var withDefault = R.merge({form: 'long', plural: 'false'});

/**
 * Implements the form fallback mechanism as described here:
 * http://docs.citationstyles.org/en/1.0.1/specification.html#terms
 *
 * @function
 * @param {object} attrs
 * @return {object[]} Array of attributes
 */
var withFallback =
  R.pipe(
    withDefault,
    R.cond([
      [R.propEq('form', 'symbol'),
        R.juxt([R.identity, setForm('short'), setForm('long')])],
      [R.propEq('form', 'verb-short'),
        R.juxt([R.identity, setForm('verb'), setForm('long')])],
      [R.either(R.propEq('form', 'verb'), R.propEq('form', 'short')),
        R.juxt([R.identity, setForm('long')])],
      [R.T, R.of]]));

/**
 * Returns a string representation of given attributes.
 *
 * @example
 * serializeAttrs({term: 'foo', form: 'long', plural: 'false'});
 * //=> 'foo/long/false'
 *
 * @function
 * @param {object} attrs
 * @return {string}
 */
var serializeAttrs =
  R.pipe(
    withDefault,
    R.props(['term', 'form', 'plural']),
    R.join('/'));

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
 * @module {function} csl-l10n-text
 * @param {object} attrs
 * @param {locale[]} locales
 * @return {string}
 */
module.exports = R.curry(function (attrs, locales) {
  return R.into('',
    R.compose(
      R.map(findTerm(R.__, locales)),
      R.reject(R.isEmpty),
      R.take(1)),
    withFallback(attrs));
});
