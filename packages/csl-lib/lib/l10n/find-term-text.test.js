const R = require('ramda');
const tap = require('tap');
const findTermText = require('./find-term-text'); // SUT

const find = findTermText(R.__, [
  {terms: [
    {name: '🌯', form: 'long', value: ['🌯']},
    {name: '🌯', form: 'short', value: ['🌮']}]},
  {terms: [
    {name: '🌯', form: 'long', value: ['🔥', '🌯🌯🌯']},
    {name: '🌯', form: 'short', value: ['🔥', '🌮🌮🌮']}]},
  {terms: [
    {name: '🌶', form: 'long', value: ['🌶']},
    {name: '🌶', form: 'verb', value: ['😱']}]}]);

tap.equal(find({term: '🌯'}), '🌯');
tap.equal(find({term: '🌯', plural: 'true'}), '🌯🌯🌯');
tap.equal(find({term: '🌯', form: 'short'}), '🌮');
tap.equal(find({term: '🌯', form: 'short', plural: 'true'}), '🌮🌮🌮');
tap.equal(find({term: '🌶'}), '🌶');
tap.equal(find({term: '🥑'}), '');
tap.equal(find({term: '🌯', form: 'symbol'}), '🌮');
tap.equal(find({term: '🌯', form: 'verb'}), '🌯');
tap.equal(find({term: '🌯', form: 'symbol', plural: 'true'}), '🌮🌮🌮');
tap.equal(find({term: '🌶', form: 'short'}), '🌶');
tap.equal(find({term: '🌶', form: 'verb-short'}), '😱');