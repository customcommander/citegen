const test = require('tap');
const {check, property, gen} = require('testcheck');
const isNumeric = require('./number-is-numeric');
const numericContentGenerator = require('../../generators/number').any;

const acceptNumericContent =
  property(
    numericContentGenerator,
    numericContent => isNumeric(numericContent) === true);

test.true(check(acceptNumericContent).result);
test.false(isNumeric('2nd edition'));
