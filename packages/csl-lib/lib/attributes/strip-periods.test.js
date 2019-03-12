const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('../output');
const sut = require('./strip-periods');

const stripPeriods = compose(toString, sut);
const out = output({}, '@strip-periods');

tap.equals(stripPeriods({'strip-periods': 'true'}, out('a.b.c')), 'abc');
tap.equals(stripPeriods({}, out('d.e.f')), 'd.e.f');
tap.equals(stripPeriods({'strip-periods': 'false'}, out('x.y.z')), 'x.y.z');
