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
  allPass,
  always,
  compose,
  cond,
  curry,
  either,
  eqBy,
  equals,
  flip,
  gt,
  identity,
  last,
  length,
  lensIndex,
  lt,
  over,
  partialRight,
  partition,
  path,
  pipe,
  prop,
  propEq,
  propSatisfies,
  reject,
  split,
  takeLast,
  test,
  unnest,
  useWith,
  when
} = require('ramda');

const findTerm = require('./find-term');
const findGender = require('./find-term-gender');

const toInt = partialRight(parseInt, [10]);
const name = prop('name');
const number = pipe(name, split('-'), last);
const text = path([0, 'value', 0]);
const isNeuter = propEq('gender-form', 'neuter');
const isFirstGroup = pipe(number, toInt, gt(10));
const multiple = compose(lt(1), length);
const match = prop('match');

const matchFunction =
  cond([
    [equals('last-digit'), always(compose(toInt, takeLast(1)))],
    [equals('last-two-digits'), always(compose(toInt, takeLast(2)))],
    [equals('whole-number'), always(toInt)]]);

const withName = useWith(flip(propSatisfies)('name'), [test, identity]);
const withGender = pipe(findGender, propEq('gender-form'), flip(either)(isNeuter));
const withNumber = curry((expected, term) => eqBy(matchFunction(match(term)), expected, number(term)));

const filterGender = when(multiple, reject(isNeuter));
const filterGroup = when(multiple, reject(isFirstGroup));

const filterTerms =
  pipe(
    partition(isFirstGroup),
    over(lensIndex(0), filterGender),
    over(lensIndex(1), filterGender),
    unnest,
    filterGroup);

module.exports = curry((locales, termName, varName, number) => {
  const predicate =
    allPass([
      withName(termName),
      withGender(locales, varName),
      withNumber(number)]);
  return compose(text, filterTerms, findTerm)
    ('long', predicate, locales);
});
