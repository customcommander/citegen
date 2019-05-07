const {
  __,
  all,
  always,
  anyPass,
  compose,
  concat,
  cond,
  curry,
  divide,
  either,
  eqBy,
  equals,
  F,
  groupWith,
  head,
  identity,
  ifElse,
  into,
  is,
  isEmpty,
  join,
  juxt,
  last,
  length,
  lt,
  map,
  mapAccum,
  modulo,
  partialRight,
  pipe,
  reject,
  repeat,
  T,
  test,
  thunkify,
  toString,
  trim,
  unless,
  when,
  zipWith
} = require('ramda');

const table = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']];

const findTermText = require('../l10n/find-term-text');
const findTermOrdinal = require('../l10n/find-term-ordinal');

const isComma = equals(',');
const isHyphen = equals('-');
const isAmpersand = equals('&');
const isSeparator = anyPass([isComma, isHyphen, isAmpersand]);

const toInt = partialRight(parseInt, [10]);
const isNumber = test(/^\d+$/);
const isNumeric = test(/^[a-z]*\d+[a-z]*$/i);
const stringify = unless(is(String), toString);

const splitNumber =
  pipe(
    groupWith(eqBy(isSeparator)),
    into([], compose(reject(isSeparator), map(trim))));

const formatSeparator =
  cond([
    [isComma, always(', ')],
    [isHyphen, always('-')],
    [isAmpersand, always(' & ')],
    [T, identity]]);

const isValid = pipe(splitNumber, ifElse(isEmpty, F, all(isNumeric)));

const toRoman =
  when(lt(__, 4000),
    pipe(
      mapAccum(
        juxt([modulo, pipe(divide, Math.floor)]),
        __,
        map(head, table)),
      last,
      zipWith(
        pipe(repeat, join('')),
        map(last, table)),
      join('')));

const toOrdinal =
  curry((locales, gender, value) =>
    pipe(
      either(
        findTermOrdinal(locales, /^ordinal-/, gender),
        thunkify(findTermText)('long', false, 'ordinal', locales)),
      concat(value))
        (value));

const toLongOrdinal =
  curry((locales, gender, value) =>
    either(
      findTermOrdinal(locales, /^long-ordinal-/, gender),
      toOrdinal(locales, gender))
        (value));

/**
 * @function
 * @param {function} formatFn
 * @param {string} str
 * @return {string}
 */
const format = curry((formatFn, str) =>
  into('',
    compose(
      map(trim),
      map(ifElse(isSeparator, formatSeparator, formatFn))),
    groupWith(eqBy(isSeparator), str)));

/**
 * @function
 * @param {string} value
 * @return {string}
 */
const formatNumeric = when(isValid, format(identity));

/**
 * @function
 * @param {string} value
 * @return {string}
 */
const formatRoman = when(isValid, format(when(isNumber, toRoman)));

/**
 * @function
 * @param {locale[]} locales
 * @param {string} gender
 * @param {string} value
 * @return {string}
 */
const formatOrdinal =
  curry((locales, gender, value) =>
    when(isValid,
      format(when(isNumber,
        toOrdinal(locales, gender))))
          (stringify(value)));

/**
 * @function
 * @param {locale[]} locales
 * @param {string} gender
 * @param {string} value
 * @return {string}
 */
const formatLongOrdinal =
  curry((locales, gender, value) =>
    when(isValid,
      format(when(isNumber,
        toLongOrdinal(locales, gender))))
          (stringify(value)));

/**
 * True if given numeric content is made of several numbers.
 *
 * @example
 * isMultiple('1, 4'); //=> true
 * isMultiple('1-4'); //=> true
 * isMultiple('1a & 4'); //=> true
 * isMultiple('1'); //=> false
 * isMultiple('1a'); //=> false
 *
 * @function
 * @param {string} value
 * @return {boolean}
 */
const isMultiple = ifElse(isValid, pipe(splitNumber, length, lt(1)) , F);

module.exports = {
  format,
  formatLongOrdinal,
  formatNumeric,
  formatOrdinal,
  formatRoman,
  isNumber,
  isNumeric: isValid,
  isMultiple,
  toInt,
  toRoman,
  stringify
};
