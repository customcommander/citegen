const {
  compose,
  converge,
  curry,
  equals,
  flip,
  has,
  identity,
  ifElse,
  into,
  join,
  last,
  lensIndex,
  map,
  nth,
  over,
  pipe,
  prop,
  split,
  toLower,
  toUpper,
  trim,
  when,
} = require('ramda');

/**
 * Checks whether `str` is a stop word.
 *
 * @example
 * isStopWord('the'); // true
 * isStopWord('hello'); // alse
 *
 * @private
 * @function
 * @param {string} str - Any string (case insensitive).
 * @return {boolean}
 */
const isStopWord = pipe(toLower, flip(has)({
  'a': true,
  'an': true,
  'and': true,
  'as': true,
  'at': true,
  'but': true,
  'by': true,
  'down': true,
  'for': true,
  'from': true,
  'in': true,
  'into': true,
  'nor': true,
  'of': true,
  'on': true,
  'onto': true,
  'or': true,
  'over': true,
  'so': true,
  'the': true,
  'till': true,
  'to': true,
  'up': true,
  'via': true,
  'with': true,
  'yet': true
}));

/**
 * Splits `str` at every word boundary.
 *
 * @example
 * splitSentence('foo, bar'); // ['foo', ', ', 'bar]
 *
 * @private
 * @function
 * @param {string} str
 * @return {string[]}
 */
const splitSentence = split(/\b/);

/**
 * Checks whether `str` is 100% lowercased.
 *
 * @example
 * isLowerCased('hello'); // true
 * isLowerCased('Hello'); // false
 *
 * @private
 * @function
 * @param {string} str
 * @return {boolean}
 */
const isLowerCased = converge(equals, [identity, toLower]);

/**
 * Checks whether `str` is 100% uppercased.
 *
 * @example
 * isUpperCased('HELLO'); // true
 * isUpperCased('Hello'); // false
 *
 * @private
 * @function
 * @param {string} str
 * @return {boolean}
 */
const isUpperCased = converge(equals, [identity, toUpper]);

/**
 * Capitalizes `word` if it is 100% lowercased.
 *
 * @example
 * capitalizeWord('hello'); // 'Hello'
 * capitalizeWord('HeLLo'); // 'HeLLo'
 *
 * @private
 * @function
 * @param {string} word
 * @return {string}
 */
const capitalizeWord = when(isLowerCased,
  compose(join(''), over(lensIndex(0), toUpper)));

/**
 * Capitalizes the first word in `str` if the word is 100% lowercased
 * and leaves the other words as is.
 *
 * @example
 * capitalizeFirst('foo bar baz'); // 'Foo bar baz'
 * capitalizeFirst('foo BAR Baz'); // 'Foo BAR Baz'
 *
 * @private
 * @function
 * @param {string} str
 * @return {string}
 */
const capitalizeFirst = pipe(
  splitSentence,
  over(lensIndex(0), capitalizeWord),
  join(''));

/**
 * Capitalizes all the words in `str` if they are 100% lowercase
 * and leaves mixed case words as is.
 *
 * @example
 * capitalizeAll('foo bar baz'); // 'Foo Bar Baz'
 * capitalizeAll('foo BAR baz'); // 'Foo BAR Baz'
 *
 * @private
 * @function
 * @param {string} str
 * @return {string}
 */
const capitalizeAll = pipe(
  splitSentence,
  into('', map(capitalizeWord)));

/**
 * Converts `str` to sentence case.
 *
 * If `str` is 100% uppercase, leaves first character as is
 * and changes the rest to lower case.
 *
 * If `str` is mixed case, capitalizes the first word if it is lower case
 * and leaves the rest as is.
 *
 * @example
 * sentenceCase('HELLO WORLD'); // 'Hello world'
 * sentenceCase('hello WORLD'); // 'Hello WORLD'
 * sentenceCase('heLLo WORLD'); // 'heLLo WORLD'
 *
 * @private
 * @function
 * @param {string} str
 * @return {string}
 */
const sentenceCase = ifElse(isUpperCased,
  pipe(toLower, capitalizeWord),
  capitalizeFirst);

/**
 * Converts `str` to title case.
 *
 * Capitalizes each lower case word in `str`.
 *
 * If a word is a stop word lower case it instead unless it is the first or last
 * word in `str` or follows a colon (':').
 *
 * @example
 * titleCase('hello world'); // 'Hello World'
 * titleCase('heal the world'); // 'Heal the World'
 * titleCase('the world is not enough'); // 'The World Is Not Enough'
 *
 * @private
 * @function
 * @param {string} str
 * @return {string}
 */
const titleCase = pipe(
  when(isUpperCased, toLower),
  splitSentence,
  (words) =>
    words.reduce((str, word, idx, words) => {
      const isStopWrd = isStopWord(word);
      const isFirstWrd = idx === 0;
      const isLastWrd = idx === words.length - 1;
      const prevChr = isFirstWrd ? '' : last(trim(nth(idx - 1, words)));
      return (!isStopWrd || (isFirstWrd || isLastWrd || prevChr === ':')) ?
        str + capitalizeWord(word) : str + toLower(word);
    }, ''));

module.exports = curry((attrs, str) => {
  const transform = prop('text-case', attrs);
  return transform === 'lowercase' ? toLower(str) :
    transform === 'uppercase' ? toUpper(str) :
    transform === 'capitalize-first' ? capitalizeFirst(str) :
    transform === 'capitalize-all' ? capitalizeAll(str) :
    transform === 'sentence' ? sentenceCase(str) :
    transform === 'title' ? titleCase(str) : str;
});