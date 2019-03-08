const tap = require('tap');

const {
  map,
  compose,
  unapply,
  flip,
  assoc,
} = require('ramda');

const {
  getYear,
  getLongYear,
  getShortYear,
  getMonth,
  getPaddedMonth,
  getShortMonth,
  getLongMonth,
  getDay,
  getPaddedDay,
  isApproximate
} = require('./date');

const locales = () => ([{
  terms: [
    { name: "ad",
      form: "long",
      gender: "neuter",
      value: ["AD"]},

    { name: "bc",
      form: "long",
      gender: "neuter",
      value: ["BC"]},

    { name: "month-01",
      form: "long",
      gender: "neuter",
      value: [ "01-long" ]},

    { name: "month-01",
      form: "short",
      gender: "neuter",
      value: [ "01-short" ]},

    { name: "month-02",
      form: "long",
      gender: "neuter",
      value: [ "02-long" ]},

    { name: "month-02",
      form: "short",
      gender: "neuter",
      value: [ "02-short" ]},

    { name: "season-01",
      form: "long",
      gender: "neuter",
      value: [ "Spring" ] },

    { name: "season-02",
      form: "long",
      gender: "neuter",
      value: [ "Summer" ] },

    { name: "season-03",
      form: "long",
      gender: "neuter",
      value: [ "Autumn" ] },

    { name: "season-04",
      form: "long",
      gender: "neuter",
      value: [ "Winter" ] } ]}]);

const date = flip(assoc('date-parts'))({});
const circa = flip(assoc('circa'))({});

const y = compose(date, unapply(map(y => [y, 99, 99])));
const m = compose(date, unapply(map(m => [9999, m, 99])));
const d = compose(date, unapply(map(d => [9999, 99, d])));

tap.deepEquals(getYear(y(2019, 2020)), [2019, 2020],
  'getYear() - returns all year parts');

tap.deepEquals(getShortYear(y(2019, 2029)), ['19', '29'],
  'getShortYear() - returns short versions of year parts');

tap.deepEquals(getMonth(m(1, 2)), [1, 2],
  'getMonth() returns all month parts');

tap.deepEquals(getPaddedMonth(m(1, 10)), ['01', '10'],
  'getPaddedMonth() returns all month parts, padded when necessary');

tap.deepEquals(getShortMonth(locales(), m(1, 2)), ['01-short', '02-short'],
  'getShortMonth() returns all month parts, short form');

tap.deepEquals(getShortMonth(locales(), m(13, 24)), ['Spring', 'Winter'],
  'getShortMonth() returns seasons');

tap.deepEquals(getLongMonth(locales(), m(1, 2)), ['01-long', '02-long'],
  'getLongMonth() returns all month parts, long form');

tap.deepEquals(getLongMonth(locales(), m(14, 23)), ['Summer', 'Autumn'],
  'getLongMonth() returns seasons');

tap.deepEquals(getDay(d(28, 29)), [28, 29],
  'getDay() returns all day parts');

tap.deepEquals(getPaddedDay(d(1, 10)), ['01', '10'],
  'getPaddedDay() returns all days parts, padded when necessary');

tap.true(isApproximate(circa(1)),
  'isApproximate() - date is uncertain if `circa` is set to `1`');

tap.false(isApproximate(circa('foo')),
  'isApproximate() - date is not uncertain if `circa` is not set to `1`');

tap.deepEquals(getLongYear(locales(), y(-1, 999)), ['-1BC', '999AD'],
  'getLongYear() - append "BC" or "AD" to years expressed as numbers');

tap.deepEquals(getLongYear(locales(), y('-5', '678')), ['-5BC', '678AD'],
  'getLongYear() - append "BC" or "AD" to years expressed as strings');

tap.deepEquals(getLongYear(locales(), y(0, 1000)), [0, 1000],
  'getLongYear() - do not append "BC" or "AD" to years outside of their range');
