const tap = require('tap');
const {always, unapply, map, omit, compose, toString} = require('ramda');
const output = require('./output');
const numberGenerator = require('../generators/number');
const {sampleOne} = require('testcheck');
const sut = require('./if'); // Subject Under Test

const ifFn = compose(toString, sut);
const children = unapply(map(compose(always, output({}, 'a-node'))));
const generateNumber = () => sampleOne(numberGenerator.any);

tap.test('match any', t => {
  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'match': 'any'
  };

  t.equals(
    ifFn([], {}, attrs, children(';', ')'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: generateNumber() }),
    ';)',
    'true if at least one value (in any condition) tests true');

  t.equals(
    ifFn([], {}, attrs, children(';', ')'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: 'NaN' }),
    '',
    'false if all values (in all conditions) test false');

  t.end();
});

tap.test('match all', t => {
  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'is-uncertain-date': 'issued accessed',
    'match': 'all'
  };

  t.equals(
    ifFn([], {}, attrs, children('>', ')'),
      { type: 'article',
        edition: generateNumber(),
        volume: generateNumber(),
        issued: {circa: 1},
        accessed: {circa: 1} }),
    '>)',
    'true when all values (in all conditions) test true');

  t.equals(
    ifFn([], {}, omit(['match'], attrs), children('>', ')'),
      { type: 'article',
        edition: generateNumber(),
        volume: generateNumber(),
        issued: {circa: 1},
        accessed: {circa: 1} }),
    '>)',
    'default value for match is "all"');

  t.equals(
    ifFn([], {}, attrs, children(';', ')'),
      { type: 'article',
        edition: generateNumber(),
        volume: 'NaN' }),
    '',
    'false if any value (in any condition) tests false');

  t.end();
});

tap.test('match none', t => {
  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'is-uncertain': 'issued accessed',
    'match': 'none'
  };

  t.equals(
    ifFn([], {}, attrs, children('<', '3'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: 'NaN',
        issued: {/* date are not approximate by default */},
        accessed: {/* date are not approximate by default */} }),
    '<3',
    'true when all values (in all conditions) test false');

  t.equals(
    ifFn([], {}, attrs, children('<', '3'),
      { type: 'unknown-type',
        edition: generateNumber(),
        volume: 'NaN' }),
    '',
    'false if any value (in any condition) tests true');

  t.end();
});