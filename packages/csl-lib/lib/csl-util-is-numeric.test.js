const tap = require('tap');
const {check, property} = require('testcheck');
const numberGen = require('./generators/number');
const isNumeric = require('./csl-util-is-numeric'); // Subject Under Test

const validateNumber = property(numberGen,
  number => isNumeric(number) === true);

tap.is(check(validateNumber).result, true,
  'returns true when content is valid');

tap.is(isNumeric('2nd edition'), false,
  'returns false when content is not valid');
