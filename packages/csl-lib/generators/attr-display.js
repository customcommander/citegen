const {gen} = require('testcheck');

/**
 * Display attribute generator.
 * @example
 * const {sampleOne} = require('testcheck');
 * const genDisplay = require('./attr-display');
 * sampleOne(genDisplay);
 * //=> {display: 'block'}
 */
module.exports = gen.object('display', gen.oneOf([
  'block',
  'left-margin',
  'right-inline',
  'indent'
]));
