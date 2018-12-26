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
  isEmpty,
  join,
  juxt,
  last,
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
  trim,
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
  curry((locales, name, value) =>
    pipe(
      either(
        findTermOrdinal(locales, /^ordinal-/, name),
        thunkify(findTermText)('long', false, 'ordinal', locales)),
      concat(value))
        (value));

const toLongOrdinal =
  curry((locales, name, value) =>
    either(
      findTermOrdinal(locales, /^long-ordinal-/, name),
      toOrdinal(locales, name))
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
 * @param {string} name
 * @param {string} value
 * @return {string}
 */
const formatOrdinal =
  curry((locales, name, value) =>
    when(isValid,
      format(when(isNumber,
        toOrdinal(locales, name))))
          (value));

/**
 * @function
 * @param {locale[]} locales
 * @param {string} name
 * @param {string} value
 * @return {string}
 */
const formatLongOrdinal =
  curry((locales, name, value) =>
    when(isValid,
      format(when(isNumber,
        toLongOrdinal(locales, name))))
          (value));

module.exports = {
  format,
  formatLongOrdinal,
  formatNumeric,
  formatOrdinal,
  formatRoman,
  isNumber,
  isNumeric: isValid,
  toInt,
  toRoman
};
