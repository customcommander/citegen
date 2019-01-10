const test = require('tap');
const sut = require('./date-day-number');
const {always, reverse} = require('ramda');

const locales = always([
  // 1st locale
  { style_options: {
      'limit-day-ordinals-to-day-1': 'false'},
    terms: [
      { name: 'ordinal-01',
        form: 'long',
        'gender-form': 'neuter',
        match: 'last-digit',
        value: ['st']},
      { name: 'ordinal',
        form: 'long',
        gender: 'neuter',
        value: ['th']}]},
  // 2nd locale
  { style_options: {
      'limit-day-ordinals-to-day-1': 'true'},
    terms: [
      { name: 'ordinal-01',
        form: 'long',
        'gender-form': 'neuter',
        match: 'last-digit',
        value: ['er']},
      { name: 'ordinal',
        form: 'long',
        gender: 'neuter',
        value: ['eme']}]}]);

test.test('when `limit-day-ordinals-to-day-1` is disabled, format any day of the month', t => {
  t.equal(sut(locales(), '1'), '1st');
  t.equal(sut(locales(), '5'), '5th');
  t.end();
});

test.test('when `limit-day-ordinals-to-day-1` is enabled, format first day of the month only', t => {
  t.equal(sut(reverse(locales()), '1'), '1er');
  t.equal(sut(reverse(locales()), '5'), '5');
  t.end();
});
