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
  converge,
  curry,
  flip,
  includes,
  into,
  map,
  mergeLeft,
  path,
  pipe,
  propSatisfies,
  unary
} = require('ramda');

const delimiter = require('./attributes/delimiter');
const display = require('./attributes/display');
const textCase = require('./attributes/text-case');
const formatting = require('./attributes/formatting');
const datePart = require('./date-part');
const findDateFormat = require('./l10n/find-date-format');

const attributesFunction = converge(
  pipe, [
    unary(delimiter),
    unary(textCase),
    unary(formatting),
    unary(display)]);

/**
 * True if <date> represents a localised date.
 * @function
 * @param {attrs} attrs
 * @return {boolean}
 */
const isLocalisedFormat = propSatisfies(flip(includes)(['text', 'numeric']), 'form');

/**
 * @param {locale[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {attrs[]} children
 * @return {array}
 */
const dateParts = (locales, macros, attrs, children) =>
  into([],
    compose(
      map(mergeLeft({variable: attrs.variable})),
      map(datePart(locales, macros)),
      map(applyTo([]))),
    children);

/**
 * Executes
 * @param {function[]} dateparts
 * @param {object} ref
 * @return {string[]}
 */
const processChildren = (dateparts, ref) =>
  into([],
    compose(
      map(applyTo(ref)),
      map(path(['format', 0]))),
    dateparts);

/**
 * @function
 * @param {locale[]} locales
 * @param {object} macros
 * @param {object} attrs
 * @param {attrs[]} children
 * @param {object} ref
 * @return {string}
 */
module.exports = curry((locales, macros, attrs, children, ref) => {
  const attributes = attributesFunction(attrs);
  const parts = isLocalisedFormat(attrs) ?
    dateParts(locales, macros, attrs, findDateFormat(attrs.form, locales)) :
    dateParts(locales, macros, attrs, children);
  return attributes(processChildren(parts, ref));
});
