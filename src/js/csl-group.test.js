import test from 'tape';
import td from 'testdouble';
import group from './csl-group';

test('it should concatenate the result of each function with optional delimiter and affixes', t => {
  const burrito = td.function();

  td.when(burrito()).thenReturn('🌯');

  let str = group({}, [burrito, burrito], {});
  t.ok(str === '🌯🌯');

  str = group({}, [burrito, burrito], {delimiter: '🍺'});
  t.ok(str === '🌯🍺🌯');

  str = group({}, [burrito, burrito], {prefix: '🌶'});
  t.ok(str === '🌶🌯🌯');

  str = group({}, [burrito, burrito], {prefix: '🌶', delimiter: '🍺'});
  t.ok(str === '🌶🌯🍺🌯');

  str = group({}, [burrito, burrito], {suffix: '🥑', delimiter: '🍺'});
  t.ok(str === '🌯🍺🌯🥑');

  str = group({}, [burrito, burrito], {suffix: '🥑'});
  t.ok(str === '🌯🌯🥑');

  str = group({}, [burrito, burrito], {prefix: '🌶', suffix: '🥑'});
  t.ok(str === '🌶🌯🌯🥑');

  str = group({}, [burrito, burrito], {prefix: '🌶', suffix: '🥑', delimiter: '🍺'});
  t.ok(str === '🌶🌯🍺🌯🥑');

  t.end();
});

test('it should return an empty string if one function return an empty string', t => {
  const burrito = td.function();
  const empty = td.function();

  td.when(burrito()).thenReturn('🌯');
  td.when(empty()).thenReturn('');

  let str = group({}, [burrito, empty, burrito], {});
  t.ok(str === '');

  str = group({}, [empty, burrito, burrito], {});
  t.ok(str === '');

  str = group({}, [burrito, burrito, empty], {});
  t.ok(str === '');

  t.end();
});

