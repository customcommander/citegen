const R = require('ramda');
const tap = require('tap');
const l10nText = require('./csl-l10n-text'); // SUT

const find = l10nText(R.__, [
  {terms: [
    {name: '🌯', single: '🌯'},
    {name: '🌯', form: 'short', single: '🌮'}]},
  {terms: [
    {name: '🌯', single: '🔥', multiple: '🌯🌯🌯'},
    {name: '🌯', form: 'short', single: '🔥', multiple: '🌮🌮🌮'}]},
  {terms: [
    {name: '🌶', single: '🌶'},
    {name: '🌶', form: 'verb', single: '😱'}]}]);

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