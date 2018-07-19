const {flatten, init, join, pipe} = require('ramda');
const {gen} = require('testcheck');

const sep = gen.oneOf([
  '-', ' -', '- ', ' - ',
  ',', ' ,', ', ', ' , ',
  '&', ' &', '& ', ' & '
]);

const affix = gen.array(gen.oneOf([
  'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E',
  'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J',
  'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O',
  'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T',
  'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y',
  'z', 'Z'
]), {minSize: 1, maxSize: 5}).then(join(''));

const num = gen.posInt.then(n => String(n));
const withPrefix = gen.array([affix, num]).then(join(''));
const withSuffix = gen.array([num, affix]).then(join(''));
const withPrefixAndSuffix = gen.array([affix, num, affix]).then(join(''));
const withAffixes = gen.oneOf([withPrefix, withSuffix, withPrefixAndSuffix]);
const single = gen.oneOf([num, withAffixes]);
const multiple = gen.array(gen.array([single, sep]), {minSize: 2}).then(pipe(flatten, init, join('')));

module.exports = {
  /**
   * Generates a single number with or without prefix or suffix
   * e.g. '1', '1000', '21st', 'D2', 'D5th', etc.
   */
  single,

  /**
   * Generates a single number guaranteed to have either a suffix or a prefix or both.
   * e.g. '42D', 'D42', 'D42D'
   */
  singleWithAffixes: withAffixes,

  /**
   * Generates two numbers (with or without prefix or suffix) separated by a valid number separator.
   * e.g. '1st, 2nd', 'R2 - D2, etc.
   */
  multiple,

  /**
   * Generates either a single or multiple number (but not both)
   * e.g. '1st', '2nd, 3rd', etc.
   */
  any: gen.oneOf([single, multiple]),

  /**
   * Generates a valid number separator.
   * With leading or trailing whitespaces (or both)
   * e.g. ',', ' -', ' & '
   */
  separator: sep
};
