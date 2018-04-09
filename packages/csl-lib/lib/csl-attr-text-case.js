var R = require('ramda');

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
var isStopWord = R.pipe(R.toLower, R.has(R.__, {
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
var splitSentence = R.split(/\b/);

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
var isLowerCased = R.converge(R.equals, [R.identity, R.toLower]);

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
var isUpperCased = R.converge(R.equals, [R.identity, R.toUpper]);

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
var capitalizeWord = R.when(isLowerCased,
  R.converge(R.concat, [
    R.pipe(R.head, R.toUpper),
    R.tail
  ])
);

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
var capitalizeFirst = R.pipe(
  splitSentence,
  R.adjust(capitalizeWord, 0),
  R.join('')
);

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
var capitalizeAll = R.pipe(
  splitSentence,
  R.into('', R.map(capitalizeWord))
);

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
var sentenceCase = R.ifElse(isUpperCased,
  R.pipe(R.toLower, capitalizeWord),
  capitalizeFirst
);

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
var titleCase = R.pipe(
  R.when(isUpperCased, R.toLower),
  splitSentence,
  function (words) {
    return words.reduce(function (str, word, idx, words) {
      var isStopWrd = isStopWord(word);
      var isFirstWrd = idx === 0;
      var isLastWrd = idx === words.length - 1;
      var prevChr = isFirstWrd ? '' : R.last(R.trim(R.nth(idx - 1, words)));
      return (!isStopWrd || (isFirstWrd || isLastWrd || prevChr === ':')) ?
        str + capitalizeWord(word) : str + R.toLower(word);
    }, '');
  }
);

module.exports = R.curry(function (attrs, str) {
  var transform = R.prop('text-case', attrs);
  if (transform === 'lowercase') return R.toLower(str);
  if (transform === 'uppercase') return R.toUpper(str);
  if (transform === 'capitalize-first') return capitalizeFirst(str);
  if (transform === 'capitalize-all') return capitalizeAll(str);
  if (transform === 'sentence') return sentenceCase(str);
  if (transform === 'title') return titleCase(str);
  return str;
});