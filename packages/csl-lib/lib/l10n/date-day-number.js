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

const {compose, eqBy, flip, ifElse, nthArg} = require('ramda');
const {toInt, formatOrdinal} = require('../utils/number');
const {firstDayOrdinal} = require('./find-option');

/**
 * True if given day is the first day of the month
 *
 * @example
 * isFirstDay('1'); //=> true
 * isFirstDay('5'); //=> false
 *
 * @function
 * @param {locale[]} locales
 * @param {string} day
 * @return {string}
 */
const isFirstDay = eqBy(toInt, 1);

/**
 * Ordinalise given day according to the style locales.
 *
 * @example
 * formatDay(locales, '1'); //=> 1st
 * formatDay(locales, '2'); //=> 2nd
 * formatDay(locales, '3'); //=> 3rd
 *
 * @function
 * @param {locale[]} locales
 * @param {string} day
 * @return {string}
 */
const formatDay = flip(formatOrdinal)('neuter');

/**
 * Ordinalise given day if it is the first day of the month,
 * Leave any other days as is.
 *
 * @example
 * formatFirstDay(locales, '1'); //=> '1st'
 * formatFirstDay(locales, '5'); //=> '5'
 *
 * @function
 * @param {locale[]} locales
 * @param {string} day
 * @return {string}
 */
const formatFirstDay = ifElse(compose(isFirstDay, nthArg(1)), formatDay, nthArg(1));

/**
 * Ordinalise a given day according to a style locales.
 * @function
 * @param {locale[]} locales
 * @param {string} day
 * @return {string}
 */
module.exports = ifElse(firstDayOrdinal, formatFirstDay, formatDay);
