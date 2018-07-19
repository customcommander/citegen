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
  anyPass,
  compose,
  concat,
  cond,
  curry,
  curryN,
  either,
  eqBy,
  equals,
  groupWith,
  ifElse,
  into,
  map,
  nthArg,
  pipe,
  propOr,
  test,
  trim,
  when
} = require('ramda');

const isNumeric = require('./utils/number-is-numeric');
const toRoman = require('./utils/number-to-roman');
const findTermOrdinal = require('./l10n/find-term-ordinal');

const isComma = equals(',');
const isHyphen = equals('-');
const isAmpersand = equals('&');
const isSeparator = anyPass([isComma, isHyphen, isAmpersand]);
const digitOnly = test(/^[0-9]+$/);

const formatSeparator =
  cond([
    [isComma, always(', ')],
    [isHyphen, always('-')],
    [isAmpersand, always(' & ')]]);

/**
 * @function
 * @param {function} formatNumber
 * @param {string} str
 * @return {string}
 */
const format = (formatNumber, str) =>
  into('',
    compose(
      map(trim),
      map(ifElse(isSeparator, formatSeparator, formatNumber))),
    groupWith(eqBy(isSeparator), str));

/**
 * @param {locale[]} locales
 * @param {object} attrs
 * @param {string} number
 */
const formatNumeric = curryN(3, nthArg(2));

/**
 * @param {locale[]} locales
 * @param {object} attrs
 * @param {string} number
 */
const formatRoman = curryN(3, pipe(nthArg(2), when(digitOnly, toRoman)));

/**
 * @param {locale[]} locales
 * @param {object} attrs
 * @param {string} number
 */
const formatOrdinal = curry((locales, attrs, number) =>
  when(digitOnly,
    pipe(
      either(
        findTermOrdinal(locales, /^ordinal-/, attrs.variable),
        findTermOrdinal(locales, 'ordinal', attrs.variable)),
      concat(number)),
    number));

const formatLongOrdinal = curry((locales, attrs, number) =>
  when(digitOnly,
    either(
      findTermOrdinal(locales, /^long-ordinal/, attrs.variable),
      formatOrdinal(locales, attrs)),
    number));

const formatFunction =
  cond([
    [equals('numeric'), always(formatNumeric)],
    [equals('roman'), always(formatRoman)],
    [equals('ordinal'), always(formatOrdinal)],
    [equals('long-ordinal'), always(formatLongOrdinal)]]);

/**
 * @function
 * @param {locale[]} locales
 * @param {object[]} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 * @return {string}
 */
module.exports = curry((locales, macros, attrs, children, ref) => {
  const form = propOr('numeric', 'form', attrs);
  const str = propOr('', attrs.variable, ref);
  const fn = formatFunction(form)(locales, attrs);
  return isNumeric(str) ? format(fn, str) : str;
});
