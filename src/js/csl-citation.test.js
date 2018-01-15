import test from 'tape';
import citation from './csl-citation';

test('it should return a citation', t => {
  t.is(citation(), 'this is a citation');
  t.end();
});
