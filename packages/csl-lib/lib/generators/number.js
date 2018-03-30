const {join} = require('ramda');
const {gen} = require('testcheck');

const sep = gen.oneOf([
  '-', ' -', '- ', ' - ',
  ',', ' ,', ', ', ' , ',
  '&', ' &', '& ', ' & '
]);

const num = gen.posInt.then(n => String(n));

const affix = gen.array(gen.oneOf([
  'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E',
  'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J',
  'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O',
  'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T',
  'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y',
  'z', 'Z'
]), {minSize: 1, maxSize: 5}).then(join(''));

const withPrefix = gen.array([affix, num]).then(arr => arr.join(''));

const withSuffix = gen.array([num, affix]).then(arr => arr.join(''));

const withPrefixAndSuffix = gen.array([affix, num, affix]).then(arr => arr.join(''));

const single = gen.oneOf([num, withPrefix, withSuffix, withPrefixAndSuffix]);

const multiple = gen.array([single, sep, single]).then(arr => arr.join(''));

module.exports = gen.oneOf([single, multiple]);
