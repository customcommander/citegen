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

const {
  converge,
  curry,
  pipe,
  propOr,
  thunkify,
  unary
} = require('ramda');

const findTermGender = require('./l10n/find-term-gender');
const output = require('./output');
const affixes = require('./attributes/affixes');
const display = require('./attributes/display');
const formatting = require('./attributes/formatting');
const textCase = require('./attributes/text-case');

const {
  formatLongOrdinal,
  formatNumeric,
  formatOrdinal,
  formatRoman
} = require('./utils/number');

/**
 * Generates a function that will apply behavioural style attributes
 * to the generated output.
 *
 * @function
 * @param {object} attrs
 * @return {function(Output): Output}
 */
const attributes = converge(
  pipe, [
    unary(textCase),
    unary(formatting),
    unary(display),
    unary(affixes)]);

/**
 * @function
 * @param {locale[]} locales
 * @param {object[]} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 * @return {Output}
 */
module.exports = curry((locales, macros, attrs, children, ref) => {
  const form = propOr('numeric', 'form', attrs);
  const number = propOr('', attrs.variable, ref);
  const gender = thunkify(findTermGender)(locales, attrs.variable);
  const format =
    (form === 'numeric' && formatNumeric) ||
    (form === 'roman' && formatRoman) ||
    (form === 'ordinal' && formatOrdinal(locales, gender())) ||
    (form === 'long-ordinal' && formatLongOrdinal(locales, gender()));
  return attributes(attrs)(output({}, 'number', format(number)));
});
