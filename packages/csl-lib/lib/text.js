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
  always,
  applyTo,
  cond,
  converge,
  curry,
  flip,
  has,
  pipe,
  prop,
  propOr,
  T,
  unary
} = require('ramda');

const output = require('./output');
const l10nText = require('./l10n/find-term-text');
const displayAttr = require('./attributes/display');
const textCaseAttr = require('./attributes/text-case');
const stripPeriodsAttr = require('./attributes/strip-periods');

const getEmptyString = always('');
const getTerm = l10nText;
const getValue = prop('value');

const getVariable = curry((ref, attrs) => ref[attrs.variable]);

const runMacro = curry(function (macros, ref, attrs) {
  return pipe(
    prop('macro'),
    flip(propOr(getEmptyString))(macros),
    applyTo(ref)
  )(attrs);
});

const attributes = converge(
  pipe, [
    unary(stripPeriodsAttr),
    unary(textCaseAttr),
    unary(displayAttr)]);

/**
 * @param {object[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {function[]} children
 * @param {object} ref
 */
module.exports = curry(function (locales, macros, attrs, children, ref) {
  const content = cond([
    [has('term'), (attrs) => getTerm('long', false, attrs.term, locales)],
    [has('variable'), getVariable(ref)],
    [has('macro'), runMacro(macros, ref)],
    [has('value'), getValue],
    [T, getEmptyString]
  ])(attrs);

  return attributes(attrs)(output({}, 'text', content));
});
