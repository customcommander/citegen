const tap = require('tap');
const sut = require('./name');

tap.equal(
  sut.formatLatinLongName({
    'given': 'Jean',
    'dropping-particle': 'de',
    'non-dropping-particle': 'La',
    'family': 'Fontaine',
    'suffix': 'III'}),
  'Jean de La Fontaine III');
