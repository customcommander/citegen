const { always } = require('ramda');
const test = require('tap');
const sut = require('./find-date-format');

const locales = always([
  {},

  { date_text: null,
    date_numeric: null },

  { date_text: [],
    date_numeric: [] },

  { date_text: [1, 2, 3],
    date_numeric: [11, 22, 33] },

  { date_text: [4, 5, 6],
    date_numeric: [44, 55, 66] }
]);

test.deepEquals(sut('text', locales()), [1, 2, 3],
  'retrieve a text-format date from locales');

test.deepEquals(sut('numeric', locales()), [11, 22, 33],
  'retrieve a numeric-format date from locales');
