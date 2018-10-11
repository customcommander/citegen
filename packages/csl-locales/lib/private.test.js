const R = require('ramda');
const tap = require('tap');
const getList = require('./private'); // SUT

/**
 * Builds a list of locale objects out of a list of language codes.
 *
 * @example
 * locales('fr', 'de', 'en');
 * //=> [{'xml:lang':'fr'},{'xml:lang':'de'},{'xml:lang':'en'}]
 * locales(undefined, 'fr');
 * //=> [{}, {'xml:lang':'fr'}]
 *
 * @function
 * @param {...string} langCode
 * @return {object[]}
 */
const locales =
  R.unapply(
    R.map(
      R.ifElse(R.isNil,
        R.always({}),
        R.objOf('xml:lang'))));

const strip = R.map(R.pick(['xml:lang']));

const run = R.curryN(2, R.pipe(getList, strip));

tap.test('unknown lang code: x-klingon', t => {
  const r = run('x-klingon');
  t.same(r(locales()), locales('en-US'));
  t.same(r(locales('en-us')), locales('en-US'));
  t.same(r(locales(undefined)), locales(undefined, 'en-US'));
  t.same(r(locales('x-klingon', 'fr')), locales('x-klingon', 'en-US'));
  t.same(r(locales(undefined, 'x-klingon', 'fr')), locales('x-klingon', undefined, 'en-US'));
  t.end();
});

tap.test('language: fr', t => {
  const r = run('fr');
  t.same(r(locales()), locales('fr-FR', 'en-US'));
  t.same(r(locales(undefined, 'fr')), locales('fr', undefined, 'fr-FR', 'en-US'));
  t.end();
});

tap.test('secondary dialect: fr-ca', t => {
  const r = run('fr-ca');
  t.same(r(locales()), locales('fr-CA', 'fr-FR', 'en-US'));
  t.same(r(locales(undefined, 'fr-ca')), locales('fr-ca', undefined, 'fr-CA', 'fr-FR', 'en-US'));
  t.same(r(locales(undefined, 'fr', 'fr-ca')), locales('fr-ca', 'fr', undefined, 'fr-CA', 'fr-FR', 'en-US'));
  t.end();
});

tap.test('primary dialect: fr-fr', t => {
  const r = run('fr-fr');
  t.same(r(locales()), locales('fr-FR', 'en-US'));
  t.same(r(locales(undefined, 'fr', 'fr-fr')), locales('fr-fr', 'fr', undefined, 'fr-FR', 'en-US'));
  t.end();
});