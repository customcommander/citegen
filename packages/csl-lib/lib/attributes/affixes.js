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
  compose,
  curry,
  identity,
  isEmpty,
  map,
  prepend
} = require('ramda');

const output = require('../output');

/**
 * @function
 * @param {string} prefix
 * @return {Output}
 */
const prefixOutput = output({}, '@prefix');

/**
 * @function
 * @param {string} suffix
 * @return {Output}
 */
const suffixOutput = output({}, '@suffix');

/**
 * @function
 * @param {string} prefix
 * @return {function(Output): Output}
 */
const withPrefix = prefix => prefix ? map(prepend(prefixOutput(prefix))) : identity;

/**
 * @function
 * @param {string} suffix
 * @return {function(Output): Output}
 */
const withSuffix = suffix => suffix ? map(append(suffixOutput(suffix))) : identity;

/**
 * @function
 * @param {object} attrs
 * @return {function(Output): Output}
 */
const withAffixes = attrs => compose(withPrefix(attrs.prefix), withSuffix(attrs.suffix));

/**
 * @function
 * @param {object} attrs
 * @param {Output} out
 * @return {Output}
 * @see {@link https://docs.citationstyles.org/en/master/specification.html#affixes}
 */
module.exports = curry((attrs, out) =>
  (isEmpty(out) ? identity : withAffixes(attrs))
    (out));
