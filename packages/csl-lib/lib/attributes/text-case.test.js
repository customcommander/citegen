const tap = require('tap');
const {compose, toString} = require('ramda');
const output = require('../output');
const sut = require('./text-case'); // Subject Under Test

const textCase = compose(toString, sut);
const out = output({}, '@text-case');

tap.is(textCase({}, out('Hello')), 'Hello', 'returns string as is if not text-case attribute has been set.');

tap.test('text-case: lowercase', t => {
  t.is(textCase({'text-case': 'lowercase'}, out('HELLO, WORLD!')), 'hello, world!', 'converts string to lower case');
  t.end();
});

tap.test('text-case: uppercase', t => {
  t.is(textCase({'text-case': 'uppercase'}, out('hello, world!')), 'HELLO, WORLD!', 'converts string to upper case');
  t.end();
});

tap.test('text-case: capitalize-first', t => {
  const attrs = {'text-case': 'capitalize-first'};
  t.is(textCase(attrs, out('hello, world!')), 'Hello, world!', 'capitalizes first word');
  t.is(textCase(attrs, out('HELLO, world!')), 'HELLO, world!', 'ignores first word if it is not in lower case');
  t.is(textCase(attrs, out('hello, WORLD!')), 'Hello, WORLD!', 'leaves other words as is');
  t.end();
});

tap.test('text-case: capitalize-all', t => {
  const attrs = {'text-case': 'capitalize-all'};
  t.is(textCase(attrs, out('hello, world!')), 'Hello, World!', 'capitalizes all words');
  t.is(textCase(attrs, out('heLLo, woRLd!')), 'heLLo, woRLd!', 'ignores words that are not in lower case');
  t.end();
});

tap.test('text-case: sentence', t => {
  const attrs = {'text-case': 'sentence'};
  t.is(textCase(attrs, out('HELLO, WORLD!')), 'Hello, world!', 'upper case: capitalizes first word, lower case the rest.');
  t.is(textCase(attrs, out('hello, woRLd!')), 'Hello, woRLd!', 'mixed case: capitalizes first word, leave the rest as is.');
  t.end();
});

tap.test('text-case: title', t => {
  const attrs = {'text-case': 'title'};
  t.is(textCase(attrs, out('hello, world!')), 'Hello, World!', 'capitalizes each lower case in a string.');
  t.is(textCase(attrs, out('HEAL THE WORLD')), 'Heal the World', 'lower case stop words.');
  t.is(textCase(attrs, out('THE WORLD IS NOT ENOUGH')), 'The World Is Not Enough', 'capitalizes stop word if it is the first word.');
  t.is(textCase(attrs, out('INTERNSHIP, THE')), 'Internship, The', 'capitalizes stop word if it is the last word.');
  t.is(textCase(attrs, out('ENOUGH: THE WORLD IS NOT')), 'Enough: The World Is Not', 'capitalizes stop word if it follows a colon.');
  t.is(textCase(attrs, out('the wOrLd is not eNougH')), 'The wOrLd Is Not eNougH', 'leaves mixed case words as is.');
  t.end();
});
