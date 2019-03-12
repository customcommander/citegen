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
  anyPass,
  append,
  compose,
  concat,
  curry,
  flip,
  has,
  into,
  is,
  isEmpty,
  join,
  map,
  of,
  pick,
  pipe,
  prepend,
  toPairs,
  unless
} = require('ramda');

const output = require('../output');

const out = output({}, '@formatting');

/**
 * An object of CSS properties & values pairs.
 *
 * @typedef {Object} FormattingAttrs
 * @property {?string} `font-style`
 * @property {?string} `font-variant`
 * @property {?string} `font-weight`
 * @property {?string} `text-decoration`
 * @property {?string} `vertical-align`
 *
 * @example
 *  {
 *    'font-style': 'italic',
 *    'font-weight': 'bold'
 *  }
 */

/**
 * An array of CSS properties & values pairs.
 *
 * @typedef {string[][]} CSSDeclarations
 *
 * @example
 *  [
 *    ['font-weight', 'bold'],
 *    ['text-decoration', 'underline'],
 *  ]
 */

/**
 * @type {string[]}
 */
const styleList =
  [ 'font-style',
    'font-variant',
    'font-weight',
    'text-decoration',
    'vertical-align' ];

/**
 * @function
 * @param {CSSDeclarations} cssDeclarations
 * @return {string}
 */
const toCss =
  into('',
    compose(
      map(join(':')),
      map(flip(concat)(';'))));

/**
 * @function
 * @param {object} attrs
 * @return {FormattingAttrs}
 */
const pickStyles = pick(styleList);

/**
 * Checks if given `attrs` object contains any formatting attributes.
 * @function
 * @param {object} attrs
 * @return {boolean}
 */
const hasStyles = anyPass(map(has, styleList));

/**
 * @example
 * generateStyle({'font-style': 'italic', 'font-weight': 'bold'});
 * //=> 'font-style:italic;font-weight:bold;
 * @function
 * @param {FormattingAttrs} attrs
 * @return {string}
 */
const generateStyle = compose(toCss, toPairs, pickStyles);

/**
 * @function
 * @param {object} attrs
 * @return {function(Output): Output}
 */
const withStyle = attrs =>
  pipe(
    map(unless(is(Array), of)),
    map(prepend(out(`<span style="${generateStyle(attrs)}">`))),
    map(append(out('</span>'))));

/**
 * @function
 * @param {object} attrs
 * @param {Output} out
 * @return {Output}
 */
module.exports = curry((attrs, out) =>
  hasStyles(attrs) && !isEmpty(out) ? withStyle(attrs)(out) : out);
