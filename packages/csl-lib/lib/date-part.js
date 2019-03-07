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
  curry,
  either,
  identity,
  isNil,
  mergeRight,
  prop,
  propEq,
  propOr,
  propSatisfies,
  useWith
} = require('ramda');

const {
  getYear,
  getMonth,
  getDay,

  getLongYear,
  getShortYear,
  getPaddedMonth,
  getLongMonth,
  getShortMonth,
  getPaddedDay,
  getOrdinalDay
} = require('./utils/date');

const getDate = useWith(propOr({}), [prop('variable'), identity]);
const noForm = propSatisfies(isNil, 'form');
const isYear = propEq('name', 'year');
const isMonth = propEq('name', 'month');
const isDay = propEq('name', 'day');
const isLong = propEq('form', 'long');
const isShort = propEq('form', 'short');
const isOrdinal = propEq('form', 'ordinal');
const isNumeric = propEq('form', 'numeric');
const isPaddedNumeric = propEq('form', 'numeric-leading-zeros');
const isLongYear = both(isYear, either(isLong, noForm));
const isShortYear = both(isYear, isShort);
const isLongMonth = both(isMonth, either(isLong, noForm));
const isShortMonth = both(isMonth, isShort);
const isNumericMonth = both(isMonth, isNumeric);
const isNumericDay = both(isDay, either(isNumeric, noForm));
const isOrdinalDay = both(isDay, isOrdinal);
const isPaddedNumericMonth = both(isMonth, isPaddedNumeric);
const isPaddedNumericDay = both(isDay, isPaddedNumeric);

/**
 * @function
 * @param {locale[]} locales
 * @param {object[]} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 * @return {object}
 */
module.exports = curry((locales, macros, attrs, children, ref) => {
  const date = getDate(attrs, ref);

  const value =
    (isYear(attrs) && getYear) ||
    (isMonth(attrs) && getMonth) ||
    (isDay(attrs) && getDay);

  const format =
    (isLongYear(attrs) && getLongYear(locales)) ||
    (isShortYear(attrs) && getShortYear) ||
    (isNumericMonth(attrs) && getMonth) ||
    (isNumericDay(attrs) && getDay) ||
    (isPaddedNumericMonth(attrs) && getPaddedMonth) ||
    (isPaddedNumericDay(attrs) && getPaddedDay) ||
    (isLongMonth(attrs) && getLongMonth(locales)) ||
    (isShortMonth(attrs) && getShortMonth(locales)) ||
    (isOrdinalDay(attrs) && getOrdinalDay(locales));

  return mergeRight(attrs, {value: value(date), format: format(date)});
});

// My four-year old daughter wanted to help me out.
// This is her contribution to the project ❤️🤡
/*
nmkfdmnbfdhchvgfyt3ecbbmnvv gciwehfjhffkhnjghgugngxbnhkndhhjljfcnk.j
*/