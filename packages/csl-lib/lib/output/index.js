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
  curry,
  has,
  into,
  is,
  map,
  mergeRight,
  of,
  prop,
  unless,
  when
} = require('ramda');

/**
 * Reduces an array of Output into a string.
 * @param {Output[]} arr
 */
const _toStr = arr =>
  into('',
    compose(
      map(when(has('@@citegen/out'), prop('@@citegen/out'))),
      map(when(is(Array), _toStr))),
    arr);

const _toString = compose(_toStr, unless(is(Array), of));

/**
 * @typedef {object} Output
 * @property {string} `@@citegen/node` node name
 * @property {string|Array<Output>} `@@citegen/out`
 */

/**
 * @function
 * @param {object} extras
 * @param {string} nodeName
 * @param {string|Array<Output>} nodeValue
 * @return {Output}
 */
const output = (extras, nodeName, nodeValue) => mergeRight(extras, {
  '@@citegen/node': nodeName,
  '@@citegen/out': nodeValue,
  'fantasy-land/map': (fn) => output(extras, nodeName, fn(nodeValue)),
  'fantasy-land/concat': (out) => output(extras, nodeName, _toString(nodeValue) + _toString(out)),
  'fantasy-land/empty': () => output({}, '', ''),
  'fantasy-land/equals': (out) => _toString(out) === _toString(nodeValue),
  toString: () => _toString(nodeValue),
});

module.exports = curry(output);
