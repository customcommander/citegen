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
  both,
  call,
  complement,
  compose,
  concat,
  converge,
  find,
  identity,
  isEmpty,
  isNil,
  pipe,
  prop,
  propSatisfies,
  useWith,
} = require('ramda');

/**
 * Returns the key to the date format for given `form`.
 * @example
 * key('text'); //=> 'date_text'
 * key('numeric'); //=> 'date_numeric'
 * @function
 * @param {dateform} form
 * @return {string}
 */
const key = concat('date_');

/**
 * @function
 * @param {any} thing
 * @return {boolean} True if a thing is not nil
 */
const notNil = complement(isNil);

/**
 * @function
 * @param {any} thing
 * @return {boolean} True if a thing is not empty
 */
const notEmpty = complement(isEmpty);

/**
 * True if given locale has given date format.
 * @function
 * @param {string} dateFormatKey
 * @param {locale} locale
 * @return {boolean}
 */
const valid = propSatisfies(both(notNil, notEmpty));

/**
 * Returns a function that finds a locale with given date format.
 * @function
 * @param {dateform} form
 * @return {function}
 */
const findFormat = converge(pipe, [compose(find, valid, key), compose(prop, key)]);

/**
 * Returns the first locale with given date format
 * @module {function} l10n/find-date-format
 * @function
 * @param {string} form
 * @param {locale[]} locales
 * @return {attrs[]}f
 */
module.exports = useWith(call, [findFormat, identity]);
