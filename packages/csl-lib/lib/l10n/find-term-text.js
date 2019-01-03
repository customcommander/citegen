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
  curry,
  head,
  ifElse,
  isNil,
  lensPath,
  pipe,
  T,
  view
} = require('ramda');


const findTerm = require('./find-term');

/*
 * Anatomy of a term object:
 *
 *   { name: 'edition',
 *     form: 'long',
 *     value: ['edition', 'editions']}
 */

const singular = view(lensPath(['value', 0]));
const plural = view(lensPath(['value', 1]));

/**
 * Extract the value of a term depending on the plural attribute.
 * @function
 * @param {object} attrs
 * @param {term} term
 * @return {string}
 */
const text = curry((attrs, term) =>
  attrs.plural === 'true' ? plural(term) : singular(term));

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
 *     value: ['foo_long_singular', 'foo_long_plural']},
 *    {name: 'foo',
 *     form: 'short',
 *     value: ['foo_short_singular', 'foo_short_plural']},
 *  ]},
 *  {terms: [
 *    {name: 'foo',
 *     form: 'verb',
 *     value: ['do_foo_singular', 'do_foo_plural']}
 *  ]}
 * ];
 *
 * findTermText({term: 'foo'}, locales); //=> 'foo_long_singular'
 * findTermText({term: 'foo', plural: 'true'}, locales); //=> 'foo_long_plural'
 * findTermText({term: 'foo', form: 'short', plural: 'true'}, locales); //=> 'foo_short_plural'
 *
 * @module {function} l10n/find-term-text
 * @param {object} attrs
 * @param {locale[]} locales
 * @return {string}
 */
module.exports = curry((attrs, locales) =>
  pipe(findTerm, head, ifElse(isNil, always(''), text(attrs)))
    (attrs, T, locales));
