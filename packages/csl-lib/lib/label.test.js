const {always, compose, toString} = require('ramda');
const test = require('tap');
const sut = require('./label'); // Subject Under Test

const nodeLabel = compose(toString, sut);

const locales = always([
  {terms: [
    {name: '🌯', form: 'symbol', value: ['🔥🔥', '🔥🔥🔥']}]},
  {terms: [
    {name: '🍣', form: 'verb-short', value: ['🍣🍣', '🍣🍣🍣']}]},
  {terms: [
    {name: '🥑', form: 'symbol', value: ['🥑🥑', '🥑🥑🥑']}]},
  {terms: [
    {name: '🌶', form: 'verb', value: ['🌶🌶', '🌶🌶🌶']}]},
  {terms: [
    {name: '🌮', form: 'short', value: ['🌮🌮', '🌮🌮🌮']}]},
  {terms: [
    {name: '🌯', form: 'long', value: ['🌯🌯', '🌯🌯🌯']}]},
  {terms: [
    {name: 'number-of-pages', form: 'long', value: ['page', 'pages']},
    {name: 'number-of-volumes', form: 'long', value: ['volume', 'volumes']}]}]);

test.test('select the required form of a term', t => {
  t.equal(nodeLabel(locales(), {}, {variable: '🍣', form: 'verb-short', plural: 'never'}, [], {'🍣': '1'}), '🍣🍣',
    'can select form "verb-short"');
  t.equal(nodeLabel(locales(), {}, {variable: '🥑', form: 'symbol', plural: 'never'}, [], {'🥑': '1'}), '🥑🥑',
    'can select form "symbol"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌶', form: 'verb', plural: 'never'}, [], {'🌶': '1'}), '🌶🌶',
    'can select form "verb"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌮', form: 'short', plural: 'never'}, [], {'🌮': '1'}), '🌮🌮',
    'can select form "short"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', form: 'long', plural: 'never'}, [], {'🌯': '1'}), '🌯🌯',
    'can select form "long"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯'}, [], {'🌯': '1'}), '🌯🌯',
    'default form is "long"');
  t.end();
});

test.test('can fallback to different form', t => {
  t.equal(nodeLabel(locales(), {}, {variable: '🌮', form: 'symbol', plural: 'never'}, [], {'🌮': '1'}), '🌮🌮',
    '"symbol" fallback to "short"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', form: 'short', plural: 'never'}, [], {'🌯': '1'}), '🌯🌯',
    '"short" fallback to "long"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌶', form: 'verb-short', plural: 'never'}, [], {'🌶': '1'}), '🌶🌶',
    '"verb-short" fallback to "verb"');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', form: 'verb', plural: 'never'}, [], {'🌯': '1'}), '🌯🌯',
    '"verb" fallback to "long"');
  t.end();
});

test.test('select the plural or singular form of a term', t => {
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'always'}, [], {'🌯': '1'}), '🌯🌯🌯',
    'always take the plural form');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'never'}, [], {'🌯': '1, 2'}), '🌯🌯',
    'never take the plural form');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'contextual'}, [], {'🌯': '1'}), '🌯🌯',
    'take the singular form if the numeric variable consists of a single number');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'contextual'}, [], {'🌯': '1, 2'}), '🌯🌯🌯',
    'take the plural form if the numeric variable consists of multiple numbers');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'contextual'}, [], {'🌯': 'NaN'}), '🌯🌯',
    'take the singular form if the numeric variable is not valid');
  t.equal(nodeLabel(locales(), {}, {variable: 'number-of-pages', plural: 'contextual'}, [], {'number-of-pages': '1'}), 'page',
    'take the singular form if "number-of-pages" is 1');
  t.equal(nodeLabel(locales(), {}, {variable: 'number-of-pages', plural: 'contextual'}, [], {'number-of-pages': '2'}), 'pages',
    'take the plural form if "number-of-pages" is greater than 1');
  t.equal(nodeLabel(locales(), {}, {variable: 'number-of-volumes', form: 'long', plural: 'contextual'}, [], {'number-of-volumes': '1'}), 'volume',
    'take the singular form if "number-of-volumes" is 1');
  t.equal(nodeLabel(locales(), {}, {variable: 'number-of-volumes', form: 'long', plural: 'contextual'}, [], {'number-of-volumes': '2'}), 'volumes',
    'take the singular form if "number-of-volumes" is greater than 1');
  t.end();
});

test.test('return an empty string if the numeric variable is empty', t => {
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'always'}, [], {}), '',
    'return an empty string if the variable is not set');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'always'}, [], {'🌯': ''}), '',
    'return an empty string if the variable is empty');
  t.equal(nodeLabel(locales(), {}, {variable: '🌯', plural: 'always'}, [], {'🌯': '0'}), '🌯🌯🌯',
    'does not mistake falsy values with empty values');
  t.end();
});


