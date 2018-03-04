const {gen} = require('testcheck');

const sep = gen.oneOf([
  '-', ' -', '- ', ' - ',
  ',', ' ,', ', ', ' , ',
  '&', ' &', '& ', ' & '
]);

const num = gen.posInt.then(n => String(n));
const affix = gen.substring('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const withPrefix = gen.array([affix, num]).then(arr => arr.join(''));
const withSuffix = gen.array([num, affix]).then(arr => arr.join(''));
const withPrefixAndSuffix = gen.array([affix, num, affix]).then(arr => arr.join(''));
const single = gen.oneOf([num, withPrefix, withSuffix, withPrefixAndSuffix]);
const multiple = gen.array([single, sep, single]).then(arr => arr.join(''));

module.exports = gen.oneOf([single, multiple]);
