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
  converge,
  curry,
  defaultTo,
  lensProp,
  map,
  over,
  pipe,
  propOr,
} = require('ramda');

const output = require('./output');
const {formatLatinLongName} = require('./utils/name');
const delimAttr = require('./attributes/delimiter');

const defaultDelimiter = over(lensProp('delimiter'), defaultTo(', '));

const attributes =
  converge(pipe, [
    compose(delimAttr, defaultDelimiter)]);

/**
 * @function
 * @param {Locale[]} locales
 * @param {object} macros
 * @param {NameAttrs} attrs
 * @param {function[]} children
 * @param {object} ref
 * @return {Output}
 */
module.exports = curry((locales, macros, attrs, children, ref) =>
  pipe(
    propOr([], attrs.variable),
    map(formatLatinLongName),
    output({name: attrs.variable}, 'name'),
    attributes(attrs))
      (ref));
