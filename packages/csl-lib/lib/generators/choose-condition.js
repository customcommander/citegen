const {isEmpty, join, mergeAll} = require('ramda');
const {gen, sampleOne} = require('testcheck');
const genType = require('./type');
const genNumberVar = require('./number-variable');
const makeList = join(' ');

const typeCondition = gen.object('type', gen.uniqueArray(genType).notEmpty().then(makeList));
const isNumericCondition = gen.object('is-numeric', gen.uniqueArray(genNumberVar).notEmpty().then(makeList));
const matchCondition = gen.object('match', gen.oneOf(['all', 'any', 'none']));

const allConditionExceptMatch = gen.array([typeCondition, isNumericCondition])
  .suchThat(arr => !isEmpty(mergeAll(arr)))
  .then(arr => mergeAll(arr));

module.exports = gen.array([allConditionExceptMatch, matchCondition]).then(mergeAll);
