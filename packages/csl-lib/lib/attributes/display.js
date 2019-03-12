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
  append,
  curry,
  is,
  isEmpty,
  map,
  of,
  pipe,
  prepend,
  unless
} = require('ramda');

const output = require('../output');

const toArr = unless(is(Array), of);

/**
 * @function
 * @param {string} className
 * @return {function(Output): Output}
 */
const openDisplay = className =>
  map(prepend(output({}, '@display', `<div class="${className}">`)));

/**
 * @function
 * @return {function(Output): Output}
 */
const closeDisplay = () =>
  map(append(output({}, '@display', '</div>')));

/**
 * @function
 * @param {string} displayType
 * @param {Output} out
 * @return {Output}
 */
const wrapWith = curry((displayType, out) =>
  pipe(openDisplay(displayType), closeDisplay())
    (map(toArr, out)));

/**
 * @type {Object<string, function(Output): Output>}
 */
const display = {
  'block': wrapWith('csl-display-line'),
  'left-margin': wrapWith('csl-display-col1'),
  'right-inline': wrapWith('csl-display-col2'),
  'indent': wrapWith('csl-display-indent')
};

module.exports = curry((attrs, out) =>
  attrs.display && !isEmpty(out) ? display[attrs.display](out) : out);
