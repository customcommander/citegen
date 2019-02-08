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
  compose,
  concat,
  curry,
  equals,
  flip,
  gt,
  into,
  isNil,
  lensProp,
  map,
  nth,
  pipe,
  prop,
  reject,
  takeLast,
  useWith,
  view,
  when
} = require('ramda');

const {toInt, stringify} = require('./number');
const l10nDayNumber = require('../l10n/date-day-number');
const l10nTermText = require('../l10n/find-term-text');

const isLt10 = compose(gt(10), toInt);
const pad = when(isLt10, compose(concat('0'), stringify));

const getDate = prop('date-parts');

const getDateParts = curry((part, date) =>
  pipe(getDate, map(nth(part)), reject(isNil))
    (date));

const getYear = getDateParts(0);
const getShortYear = pipe(getYear, into([], compose(map(stringify), map(takeLast(2)))));
const getMonth = getDateParts(1);
const getPaddedMonth = compose(map(pad), getMonth);
const getDay = getDateParts(2);
const getPaddedDay = compose(map(pad), getDay);
const getOrdinalDay = useWith(map, [l10nDayNumber, getDay]);

const getLongMonth = curry((locales, date) => {
  const name = pipe(pad, concat('month-'));
  return map(pipe(name, flip(l10nTermText('form', false))(locales)), getMonth(date));
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
  getShortYear,
  getMonth,
  getPaddedMonth,
  getLongMonth,
  getShortMonth,
  getDay,
  getPaddedDay,
  getOrdinalDay,
  isApproximate
};
