const {unapply, map, always, omit} = require('ramda');
const tap = require('tap');
const numberGenerator = require('../generators/number');
const {sampleOne} = require('testcheck');
const ifFn = require('./if'); // Subject Under Test

const children = unapply(map(always));
const generateNumber = () => sampleOne(numberGenerator.any);

tap.test('match any', t => {
  const sut = ifFn([]/* locales */, {}/* macros */);

  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'match': 'any'
  };

  t.equals(
    sut(attrs, children(';', ')'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: generateNumber() }),
    ';)',
    'true if at least one value (in any condition) tests true');

  t.equals(
    sut(attrs, children(';', ')'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: 'NaN' }),
    '',
    'false if all values (in all conditions) test false');

  t.end();
});

tap.test('match all', t => {
  const sut = ifFn([]/* locales */, {}/* macros */);

  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'match': 'all'
  };

  t.equals(
    sut(attrs, children('>', ')'),
      { type: 'article',
        edition: generateNumber(),
        volume: generateNumber() }),
    '>)',
    'true when all values (in all conditions) test true');

  t.equals(sut(omit(['match'], attrs), children('>', ')'),
    { type: 'article',
      edition: generateNumber(),
      volume: generateNumber() }),
    '>)',
    'default value for match is "all"');

  t.equals(sut(attrs, children(';', ')'),
    { type: 'article',
      edition: generateNumber(),
      volume: 'NaN' }),
    '',
    'false if any value (in any condition) tests false');

  t.end();
});

tap.test('match none', t => {
  const sut = ifFn([]/* locales */, {}/* macros */);

  const attrs = {
    'type': 'article',
    'is-numeric': 'edition volume',
    'match': 'none'
  };

  t.equals(
    sut(attrs, children('<', '3'),
      { type: 'unknown-type',
        edition: 'NaN',
        volume: 'NaN' }),
    '<3',
    'true when all values (in all conditions) test false');

  t.equals(sut(attrs, children('<', '3'),
    { type: 'unknown-type',
      edition: generateNumber(),
      volume: 'NaN' }),
    '',
    'false if any value (in any condition) tests true');

  t.end();
});