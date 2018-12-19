const {gen} = require('testcheck');

const vars = [
  'chapter-number',
  'collection-number',
  'edition',
  'issue',
  'number',
  'number-of-pages',
  'number-of-volumes',
  'volume'
];

module.exports = exports = gen.oneOf(vars);
