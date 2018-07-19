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
 * @file Convert a number to roman numerals
 * @author Julien Gonzalez <hello@spinjs.com>
 */
var R = require('ramda');

var table = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']];

/**
 * Converts given number `num` to roman numerals.
 * Numbers >= 4000 will be returned as is.
 *
 * @example
 * toRoman(42); //=> XLII
 * toRoman(4096); //=> 4096
 *
 * @param {number} num
 * @return {string}
 */
module.exports =
  R.when(R.lt(R.__, 4000),
    R.pipe(
      R.mapAccum(
        R.juxt([R.modulo, R.pipe(R.divide, Math.floor)]),
        R.__,
        R.map(R.head, table)),
      R.last,
      R.zipWith(
        R.pipe(R.repeat, R.join('')),
        R.map(R.last, table)),
      R.join('')));
