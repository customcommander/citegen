const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('../output');
const sut = require('./affixes'); // Subject Under Test

const input = output({}, 'a-node');
const affixes = compose(toString, sut);

tap.equal(affixes({}, input('aaa')), 'aaa',
  'default sut are empty strings');

tap.equal(affixes({prefix: '(', suffix: ')'}, input('aaa')), '(aaa)',
  'apply sut on non-empty string');

tap.equal(affixes({prefix: '(', suffix: ')'}, input('')), '',
  'does not apply affixes on empty string');
