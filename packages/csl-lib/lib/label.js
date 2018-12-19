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
  curry,
  flip,
  includes,
  propOr
} = require('ramda');

const findTermText = require('./l10n/find-term-text');
const {isNumeric, isMultiple, toInt} = require('./utils/number');

const isQuantityVariable = flip(includes)(['number-of-pages', 'number-of-volumes']);

const isPlural = (varName, varValue) =>
  (isQuantityVariable(varName) && toInt(varValue) > 1) ||
  (isNumeric(varValue) && isMultiple(varValue));

const usePlural = (plural, varName, varValue) =>
  (plural === 'always') ||
  (plural === 'contextual' && isPlural(varName, varValue));

/**
 * @function
 * @param {locale[]} locales
 * @param {object[]} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 * @return {string}
 */
module.exports = curry((locales, macros, attrs, children, ref) => {
  const form = attrs.form || 'long';
  const varName = attrs.variable;
  const varValue = propOr('', varName, ref);
  const plural = usePlural(attrs.plural || 'contextual', varName, varValue);
  return varValue === '' ? '' : findTermText(form, plural, varName, locales);
});
