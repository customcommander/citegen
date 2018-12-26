const R = require('ramda');
const tap = require('tap');
const findTermText = require('./find-term-text'); // SUT

const find = findTermText(R.__, R.__, R.__, [
  {terms: [
    {name: '🌯', form: 'long', value: ['🌯', '🌯🌯🌯']},
    {name: '🌯', form: 'short', value: ['🌮', '🌮🌮🌮']}]},
  {terms: [
    {name: '🌶', form: 'long', value: ['🌶']},
    {name: '🌶', form: 'verb', value: ['😱']}]}]);

tap.equal(find('long', false, '🌯'), '🌯');
tap.equal(find('long', true, '🌯'), '🌯🌯🌯');
tap.equal(find('short', false, '🌯'), '🌮');
tap.equal(find('short', true, '🌯'), '🌮🌮🌮');
tap.equal(find('long', false, '🌶'), '🌶');
tap.equal(find('long', false, '🥑'), '');
tap.equal(find('symbol', false, '🌯'), '🌮');
tap.equal(find('verb', false, '🌯'), '🌯');
tap.equal(find('symbol', true, '🌯'), '🌮🌮🌮');
tap.equal(find('short', false, '🌶'), '🌶');
tap.equal(find('verb-short', false, '🌶'), '😱');
