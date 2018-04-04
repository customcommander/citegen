const {join} = require('ramda');
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
const single = gen.oneOf([num, withPrefix, withSuffix, withPrefixAndSuffix]);
const multiple = gen.array([single, sep, single]).then(join(''));

module.exports = exports = gen.oneOf([single, multiple]);
