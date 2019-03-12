const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('../output');
const sut = require('./formatting'); // SUT

const o = output({}, 'a-node');
const formatting = compose(toString, sut);

tap.equal(
  formatting({}, o('foo')),
  'foo',
  'return `str` as is if there are no formatting attributes');

tap.equal(
  formatting({}, o('')),
  '',
  'does not apply formatting attributes on empty output');

tap.equal(
  formatting(
    { 'font-style': 'A',
      'font-variant': 'B',
      'font-weight': 'C',
      'text-decoration': 'D',
      'vertical-align': 'E' }, o('foo')),
  '<span style="font-style:A;font-variant:B;font-weight:C;text-decoration:D;vertical-align:E;">foo</span>',
  'support the following formatting attribute: `font-style`');

