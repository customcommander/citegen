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
  concat,
  converge,
  flip,
  identity,
  isEmpty,
  pipe,
  propOr,
  unary,
  unless,
  useWith,
} = require('ramda');

/**
 * Prepend `attrs.prefix` to `str`
 * @function
 * @param {object} attrs
 * @param {string} str
 * @return {string}
 */
const prefix = useWith(concat, [propOr('', 'prefix'), identity]);

/**
 * Append `attrs.prefix` to `str`
 * @function
 * @param {object} attrs
 * @param {string} str
 * @return {string}
 */
const suffix = useWith(flip(concat), [propOr('', 'suffix'), identity]);


/**
 * Generates a function that will apply affixes to given `str`.
 * @function
 * @param {object} attrs
 * @param {string} str
 * @return {function}
 */
const affixes = converge(pipe, [unary(prefix), unary(suffix)]);

/**
 * @function
 * @param {object} attrs
 * @param {string} str
 * @return {string}
 * @see {@link https://docs.citationstyles.org/en/master/specification.html#affixes}
 */
module.exports = useWith(unless(isEmpty), [affixes, identity]);