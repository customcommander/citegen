const {
  identity,
  join,
  propOr,
  useWith
} = require('ramda');

/**
 * @function
 * @param {object} attrs
 * @param {string} output
 * @return {string}
 */
module.exports = useWith(join, [propOr('', 'delimiter'), identity]);
