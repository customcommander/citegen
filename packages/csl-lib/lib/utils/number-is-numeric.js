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
 * @file Module for checking if a string contains numeric content.
 * @author Julien Gonzalez <hello@spinjs.com>
 */

var R = require('ramda');

/**
 * True if given string looks like a valid CSL number.
 *
 * @example
 * isNumber('42'); //=> true
 * isNumber('D42'); //=> true
 * isNumber('42D'); //=> true
 * isNumber('D42D'); //=> true
 * isNumber('DD'); //=> false
 * isNumber('42, 42'); //=> false
 *
 * @function
 * @param {string} str Any string
 * @return {boolean}
 */
var isNumber = R.test(/^[a-z]*\d+[a-z]*$/i);

/**
 * @module {function} utils/number-is-numeric
 * @param {string} str
 * @return {boolean}
 */
module.exports =
  R.pipe(
    R.split(/[,\-&]/),
    R.all(R.o(isNumber, R.trim)));