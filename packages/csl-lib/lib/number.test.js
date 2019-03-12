const {always, compose, toString} = require('ramda');
const test = require('tap');
const {check, property} = require('testcheck');
const romanNumberGenerator = require('../generators/roman-number');
const sut = require('./number'); // Subject Under Test
const nodeNumber = compose(toString, sut);

const locales = always([
  {terms: [
    {name: 'feminine_word', form: 'long', value: ['n/a'], gender: 'feminine'},
    {name: 'masculine_word', form: 'long', value: ['n/a'], gender: 'masculine'},
    {name: 'neuter_word', form: 'long', value: ['n/a'], gender: 'neuter'}]},
  {terms: [
    {name: 'long-ordinal-01', form: 'long', value: ['premiere'], 'gender-form': 'feminine', match: 'whole-number'},
    {name: 'long-ordinal-01', form: 'long', value: ['premier'], 'gender-form': 'masculine', match: 'whole-number'},
    {name: 'long-ordinal-01', form: 'long', value: ['first'], 'gender-form': 'neuter', match: 'whole-number'},
    {name: 'long-ordinal-02', form: 'long', value: ['second'], 'gender-form': 'neuter', match: 'whole-number'}]},
  {terms: [
    {name: 'ordinal-01', form: 'long', value: ['re'], 'gender-form': 'feminine', match: 'last-digit'},
    {name: 'ordinal-01', form: 'long', value: ['er'], 'gender-form': 'masculine', match: 'last-digit'},
    {name: 'ordinal-01', form: 'long', value: ['st'], 'gender-form': 'neuter', match: 'last-digit'},
    {name: 'ordinal-02', form: 'long', value: ['nd'], 'gender-form': 'neuter', match: 'last-digit'},
    {name: 'ordinal-03', form: 'long', value: ['rd'], 'gender-form': 'neuter', match: 'last-digit'},
    {name: 'ordinal-05', form: 'long', value: ['th(05)'], 'gender-form': 'neuter', match: 'whole-number'},
    {name: 'ordinal-06', form: 'long', value: ['th(06)'], 'gender-form': 'neuter', match: 'last-digit'},
    {name: 'ordinal-13', form: 'long', value: ['th(13)'], 'gender-form': 'neuter', match: 'last-two-digits'},
    {name: 'ordinal-14', form: 'long', value: ['th(14)'], 'gender-form': 'neuter', match: 'whole-number'},
    {name: 'ordinal-17', form: 'long', value: ['th(17)'], 'gender-form': 'neuter', match: 'last-two-digits'}]},
  {terms: [
    {name: 'ordinal', form: 'long', value: ['th(default)'], 'gender': 'neuter'}]}]);

// NUMERIC FORM

test.equal(nodeNumber([], [], {variable: 'edition'}, [], {edition: '1'}),
  '1',
  'numeric: is the default format');

test.equal(nodeNumber([], [], {variable: 'edition'}, [], {edition: '  2nd  edition  '}),
  '  2nd  edition  ',
  'numeric: render variable as is if content is not numeric');

test.equal(nodeNumber([], [], {variable: 'edition'}, [], {edition: '  1st  ,  3rd  -  7  &  10th  -  12th  ,  17  , 21st  '}),
  '1st, 3rd-7 & 10th-12th, 17, 21st',
  'numeric: variable content is normalized');

// ROMAN FORM

const romanConversionProperty = property(romanNumberGenerator, ([roman, arabic]) =>
  nodeNumber([], [], {variable: 'edition', form: 'roman'}, [], {edition: `${arabic}`}) === roman);

test.equals(check(romanConversionProperty).result, true,
  'roman: converts arabic numbers to roman numbers');

test.equals(nodeNumber([], [], {variable: 'edition', form: 'roman'}, [], {edition: '  2nd  edition  '}),
  '  2nd  edition  ',
  'roman: render variable as is if content is not numeric');

test.equals(nodeNumber([], [], {variable: 'edition', form: 'roman'}, [], {edition: '1, 2nd, 3, 4th, 5'}),
  'I, 2nd, III, 4th, V',
  'roman: do not convert numbers with affixes');

test.equal(nodeNumber([], [], {variable: 'edition', form: 'roman'}, [], {edition: '  1st  ,  3rd  -  7  &  10th  -  12th  ,  17  , 21st  '}),
  '1st, 3rd-VII & 10th-12th, XVII, 21st',
  'roman: variable content is normalized');

// ORDINAL FORM

test.equal(nodeNumber(locales(), [], {variable: 'feminine_word', form: 'ordinal'} , [], {feminine_word: '1'}),
  '1re',
  'ordinal: use the feminine form');

test.equal(nodeNumber(locales(), [], {variable: 'masculine_word', form: 'ordinal'} , [], {masculine_word: '1'}),
  '1er',
  'ordinal: use the masculine form');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '1'}),
  '1st',
  'ordinal: use the neuter form');

test.equal(nodeNumber(locales(), [], {variable: 'feminine_word', form: 'ordinal'} , [], {feminine_word: '2'}),
  '2nd',
  'ordinal: fallback to neuter form');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '7'}),
  '7th(default)',
  'ordinal: fallback to default ordinal');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '1016'}),
  '1016th(06)',
  'ordinal: numbers < 10 are matched on the last digit by default');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '1017'}),
  '1017th(17)',
  'ordinal: numbers >= 10 are matched on the last two digits by default');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '13'}),
  '13th(13)',
  'ordinal: use the ordinal from the highest ordinal group when there are matches in both groups');

test.test('ordinal: can match on the full number when needed', t => {
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '105'}), '105th(default)');
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '5'}), '5th(05)');
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '114'}), '114th(default)');
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '14'}), '14th(14)');
  t.end();
});

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '1, 2a, 3, 4b'}),
  '1st, 2a, 3rd, 4b',
  'ordinal: numbers with affixes are never ordinalized');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'ordinal'} , [], {neuter_word: '  1  ,  2  -  3  &  2  -  3  '}),
  '1st, 2nd-3rd & 2nd-3rd',
  'ordinal: numbers with affixes are never ordinalized');

// LONG ORDINAL

test.equal(nodeNumber(locales(), [], {variable: 'feminine_word', form: 'long-ordinal'} , [], {feminine_word: '1'}),
  'premiere',
  'long-ordinal: use the feminine form');

test.equal(nodeNumber(locales(), [], {variable: 'masculine_word', form: 'long-ordinal'} , [], {masculine_word: '1'}),
  'premier',
  'long-ordinal: use the masculine form');

test.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'long-ordinal'} , [], {neuter_word: '1'}),
  'first',
  'long-ordinal: use the neuter form');

test.equal(nodeNumber(locales(), [], {variable: 'feminine_word', form: 'long-ordinal'} , [], {feminine_word: '2'}),
  'second',
  'long-ordinal: fallback to neuter form');

test.test('long-ordinal: fallback to ordinal', t => {
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'long-ordinal'} , [], {neuter_word: '5'}), '5th(05)',);
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'long-ordinal'} , [], {neuter_word: '13'}), '13th(13)',);
  t.equal(nodeNumber(locales(), [], {variable: 'neuter_word', form: 'long-ordinal'} , [], {neuter_word: '7'}), '7th(default)');
  t.end();
});
