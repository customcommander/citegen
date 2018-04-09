const tap = require('tap');
const textCase = require('./csl-attr-text-case'); // Subject Under Test

tap.is(textCase({}, 'Hello'), 'Hello', 'returns string as is if not text-case attribute has been set.');
tap.is(textCase({'text-case': 'foo'}, 'Hello'), 'Hello', 'returns string as is if text-case attribute is not valid.');

tap.test('text-case: lowercase', t => {
  const out = textCase({'text-case': 'lowercase'}, 'HELLO, WORLD!');
  t.is('hello, world!', out, 'converts string to lower case');
  t.end();
});

tap.test('text-case: uppercase', t => {
  const out = textCase({'text-case': 'uppercase'}, 'hello, world!');
  t.is('HELLO, WORLD!', out, 'converts string to upper case');
  t.end();
});

tap.test('text-case: capitalize-first', t => {
  const attrs = {'text-case': 'capitalize-first'};
  let out;

  out = textCase(attrs, 'hello, world!');
  t.is('Hello, world!', out, 'capitalizes first word');

  out = textCase(attrs, 'HELLO, world!');
  t.is('HELLO, world!', out, 'ignores first word if it is not in lower case');

  out = textCase(attrs, 'hello, WORLD!');
  t.is('Hello, WORLD!', out, 'leaves other words as is');

  t.end();
});

tap.test('text-case: capitalize-all', t => {
  const attrs = {'text-case': 'capitalize-all'};
  let out;

  out = textCase(attrs, 'hello, world!');
  t.is('Hello, World!', out, 'capitalizes all words');

  out = textCase(attrs, 'heLLo, woRLd!');
  t.is('heLLo, woRLd!', out, 'ignores words that are not in lower case');

  t.end();
});

tap.test('text-case: sentence', t => {
  const attrs = {'text-case': 'sentence'};
  let out;

  out = textCase(attrs, 'HELLO, WORLD!');
  t.is('Hello, world!', out, 'upper case: capitalizes first word, lower case the rest.');

  out = textCase(attrs, 'hello, woRLd!');
  t.is('Hello, woRLd!', out, 'mixed case: capitalizes first word, leave the rest as is.');

  t.end();
});

tap.test('text-case: title', t => {
  const attrs = {'text-case': 'title'};
  let out;

  out = textCase(attrs, 'hello, world!');
  t.is('Hello, World!', out, 'capitalizes each lower case in a string.');

  out = textCase(attrs, 'HEAL THE WORLD');
  t.is('Heal the World', out, 'lower case stop words.');

  out = textCase(attrs, 'THE WORLD IS NOT ENOUGH');
  t.is('The World Is Not Enough', out, 'capitalizes stop word if it is the first word.');

  out = textCase(attrs, 'INTERNSHIP, THE');
  t.is('Internship, The', out, 'capitalizes stop word if it is the last word.');

  out = textCase(attrs, 'ENOUGH: THE WORLD IS NOT');
  t.is('Enough: The World Is Not', out, 'capitalizes stop word if it follows a colon.');

  out = textCase(attrs, 'the wOrLd is not eNougH');
  t.is('The wOrLd Is Not eNougH', out, 'leaves mixed case words as is.');

  t.end();
});
