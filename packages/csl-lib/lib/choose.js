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
  applyTo,
  compose,
  curry,
  into,
  isEmpty,
  map,
  reject,
  take
} = require('ramda');

const output = require('./output');

const out = output({}, 'choose');

/**
 * @param {object} ref
 * @return {function(function[]): string}
 */
const applyChildrenFunction = (ref) =>
  into('',
    compose(
      map(applyTo(ref)),
      reject(isEmpty),
      take(1)));

/**
 * @function
 * @param {locale[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 */
module.exports = curry((locales, macros, attrs, children, ref) =>
  compose(out, applyChildrenFunction(ref))
    (children));
