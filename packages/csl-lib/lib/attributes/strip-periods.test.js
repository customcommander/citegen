const tap = require('tap');
const sut = require('./strip-periods');

const strip = sut({'strip-periods': 'true'});
const noStrip = sut({});

tap.equals(strip('foo.bar.baz'), 'foobarbaz');
tap.equals(noStrip('foo.bar.baz'), 'foo.bar.baz');
