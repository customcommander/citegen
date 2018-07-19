const tap = require('tap');
const {gen, check, property} = require('testcheck');
const romanNumberGen = require('../generators/roman-number');
const toRoman = require('./number-to-roman'); // SUT

const romanConversion =
  property(romanNumberGen,
    ([roman, arabic]) => toRoman(arabic) === roman);

const ignoreBigNumber =
  property(gen.intWithin(4000, Infinity),
    (number) => toRoman(number) === number);

tap.is(check(romanConversion).result, true,
  'verify conversion to roman numerals');

tap.is(check(ignoreBigNumber).result, true,
  'verify big numbers are not converted to roman numerals');
