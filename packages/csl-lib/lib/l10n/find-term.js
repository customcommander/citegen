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
  always,
  both,
  compose,
  concat,
  cond,
  curry,
  equals,
  filter,
  isEmpty,
  map,
  propEq,
  propOr,
  reject,
  T,
  take,
  transduce
} = require('ramda');


/**
 * Finds a term in a given list of locales `locales`
 * that satisfies the attributes `attrs`.
 *
 * @param {locale[]} locales
 * @param {function} validate
 * @return {string}
 */
const findTerm = curry((predicate, locales) =>
  transduce(
    compose(
      map(propOr([], 'terms')),
      map(filter(predicate)),
      reject(isEmpty),
      take(1)),
    concat,
    [],
    locales));

/**
 * Implements the form fallback mechanism as described here:
 * http://docs.citationstyles.org/en/1.0.1/specification.html#terms
 *
 * @function
 * @param {string} form
 * @return {string[]}
 */
const fallback =
  cond([
    [equals('symbol'), always(['symbol', 'short', 'long'])],
    [equals('verb-short'), always(['verb-short', 'verb', 'long'])],
    [equals('verb'), always(['verb', 'long'])],
    [equals('short'), always(['short', 'long'])],
    [T, always(['long'])]]);

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
 * @module {function} l10n/find-term
 * @param {string} form
 * @param {function} predicate
 * @param {locale[]} locales
 * @return {term[]}
 */
module.exports = curry((form, predicate, locales) =>
  transduce(
    compose(
      map(form => both(propEq('form', form), predicate)),
      map(predicate => findTerm(predicate, locales)),
      reject(isEmpty),
      take(1)),
    concat,
    [],
    fallback(form)));
