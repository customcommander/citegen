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
  compose,
  concat,
  cond,
  curry,
  curryN,
  equals,
  flip,
  gt,
  into,
  isNil,
  lensProp,
  lt,
  map,
  nth,
  nthArg,
  pipe,
  prop,
  reject,
  T,
  takeLast,
  useWith,
  view,
  when
} = require('ramda');

const {toInt, stringify} = require('./number');
const l10nDayNumber = require('../l10n/date-day-number');
const l10nTermText = require('../l10n/find-term-text');

const isLt10 = compose(gt(10), toInt);
const isBcYear = compose(gt(0), toInt);
const isAdYear = compose(both(lt(0), gt(1000)), toInt);

/**
 * Returns the text for the `ad` term.
 * @function
 * @param {locale[]} locales
 * @return {string}
 */
const adText = l10nTermText('long', false, 'ad');

/**
 * Returns the text for the `bc` term.
 * @function
 * @param {locale[]} locales
 * @return {string}
 */
const bcText = l10nTermText('long', false, 'bc');

/**
 * Appends the `ad` term to a date
 * @example
 * withAd(locales, 900); //=> '900AD'
 * @function
 * @param {locale[]} locales
 * @param {string|numer} year
 * @return {string}
 */
const withAd = useWith(flip(concat), [adText, stringify]);

/**
 * Appends the `bc` term to a date
 * @example
 * withBc(locales, -2000); //=> '-2000BC'
 * @function
 * @param {locale[]} locales
 * @param {string|numer} year
 * @return {string}
 */
const withBc = useWith(flip(concat), [bcText, stringify]);

/**
 * @param {locale[]} locales
 * @param {string|number} year
 * @return {string}
 */
const withAdOrBc = curryN(2, cond([
  [compose(isBcYear, nthArg(1)),
    withBc],
  [compose(isAdYear, nthArg(1)),
    withAd],
  [T,
    nthArg(1)]]));

const pad = when(isLt10, compose(concat('0'), stringify));

const getDate = prop('date-parts');

const getDateParts = curry((part, date) =>
  pipe(getDate, map(nth(part)), reject(isNil))
    (date));

// raw date parts

const getYear = getDateParts(0);
const getMonth = getDateParts(1);
const getDay = getDateParts(2);

// formatted date parts

const getLongYear = curry((locales, date) =>
  pipe(getYear, map(withAdOrBc(locales)))
    (date));

const getShortYear = pipe(getYear, into([], compose(map(stringify), map(takeLast(2)))));
const getPaddedMonth = compose(map(pad), getMonth);
const getPaddedDay = compose(map(pad), getDay);
const getOrdinalDay = useWith(map, [l10nDayNumber, getDay]);

const getLongMonth = curry((locales, date) => {
  const name = pipe(pad, concat('month-'));
  return map(pipe(name, flip(l10nTermText('long', false))(locales)), getMonth(date));
});

const getShortMonth = curry((locales, date) =>{
  const name = pipe(pad, concat('month-'));
  return map(pipe(name, flip(l10nTermText('short', false))(locales)), getMonth(date));
});

/**
 * @function
 * @param {object}
 * @return {boolean}
 */
const isApproximate = compose(equals(1), view(lensProp('circa')));

module.exports = {
  getYear,
  getMonth,
  getDay,
  getLongYear,
  getShortYear,
  getPaddedMonth,
  getLongMonth,
  getShortMonth,
  getPaddedDay,
  getOrdinalDay,
  isApproximate
};
