const {gen} = require('testcheck');

module.exports = {
  numberVarName: gen.oneOf([
    'chapter-number',
    'collection-number',
    'edition',
    'issue',
    'number',
    'number-of-pages',
    'number-of-volumes',
    'volume'
  ])
}
