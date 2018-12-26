const test = require('tap');
const {check, property, gen} = require('testcheck');
const {isNumeric} = require('./number');
const numericContentGenerator = require('../../generators/number').any;

const acceptNumericContent =
  property(
    numericContentGenerator,
    numericContent => isNumeric(numericContent) === true);

test.true(check(acceptNumericContent).result);
test.false(isNumeric('2nd edition'));
test.false(isNumeric(''), 'an empty string is not a valid numeric content');
