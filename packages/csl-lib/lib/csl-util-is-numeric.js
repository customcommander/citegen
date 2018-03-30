var R = require('ramda');
var RE_NUMBER = /^[a-z]*\d+[a-z]*$/i;
var RE_NUMBER_SEPARATOR = /[,\-&]/;

var isNumeric = R.pipe(
  R.split(RE_NUMBER_SEPARATOR),
  R.all(R.pipe(
    R.trim,
    R.test(RE_NUMBER)
  ))
);

module.exports = R.ifElse(R.is(String), isNumeric, R.F);
