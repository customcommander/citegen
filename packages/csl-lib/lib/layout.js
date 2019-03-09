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
  into,
  isEmpty,
  map,
  pipe,
  reject,
  unary
} = require('ramda');

const formatting = require('./attributes/formatting');
const affixes = require('./attributes/affixes');
const delimiter = require('./attributes/delimiter');

const attributes = converge(
  pipe, [
    unary(delimiter),
    unary(formatting),
    unary(affixes)]);

/**
 * Render given reference by apply to its children.
 * @param {function[]} children
 * @param {object} ref
 * @return {string}
 */
const applyChildren = curry((children, ref) =>
  into('', compose(map(applyTo(ref))), children));

/**
 * Renders all references by applying each to all children.
 * @param {function[]} children
 * @param {object[]} refs
 * @return {array}
 */
const render = (children, refs) =>
  into([], compose(map(applyChildren(children)), reject(isEmpty)), refs);

/**
 * @param {locale[]} locales
 * @param {object} macros
 * @param {attrs} attrs
 * @param {function[]} children
 * @param {object[]} refs
 */
module.exports = curry((locales, macros, attrs, children, refs) =>
  attributes(attrs)(render(children, refs)));
