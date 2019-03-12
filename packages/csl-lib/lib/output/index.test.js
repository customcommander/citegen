const tap = require('tap');
const sut = require('./index');
const {map, toUpper, toString, isEmpty, equals, concat} = require('ramda');

const o = sut({}, 'foo');

tap.match(sut({foo: 'bar'}, 'xxx', 'yyy'), {
  '@@citegen/node': 'xxx',
  '@@citegen/out': 'yyy',
  'foo': 'bar'
});

tap.equal(toString(map(toUpper, o('yyy'))), 'YYY');

tap.test('output objects can be compared for equality', t => {
  const out1 = o([
    o([o('h'), o('e')]),
    o([o('l'), o([o('l')])]),
    o('o')
  ]);

  const out2 = o([
    o([o('h'), o('e')]),
    o([o('l'), o([o('l')])]),
    o('o')
  ]);

  t.true(equals(out1, out2));
  t.end();
});

tap.test('output objects can be concatenated', t => {
  const out1 = o('foo');
  const out2 = o('bar');

  t.is(toString(concat(out1, out2)), 'foobar');
  t.end();
});

tap.true(isEmpty(o('')));
