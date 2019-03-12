const tap = require('tap');
const {compose, toString, merge} = require('ramda');
const {gen, check, property} = require('testcheck');
const td = require('testdouble');
const output = require('./output');
const genDisplayAttr = require('../generators/attr-display');
const displayAttr = require('./attributes/display');
const sut = require('./text'); // Subject Under Test

const textFn = compose(toString, sut);

tap.test('should support a "value" attribute', t => {
  t.is(textFn([{}], {}, {value: 'hello'}, [], {}), 'hello');
  t.end();
});

tap.test('should support a "variable" attribute', t => {
  t.is(textFn([{}], {}, {variable: 'message'}, [], {message: 'hello'}), 'hello');
  t.end();
});

tap.test('should support a "macros" attribute', t => {
  const person = {name: 'John Doe'};
  const sayHello = td.function();

  td.when(sayHello(person)).thenReturn(`Hello ${person.name}!`);

  t.is(textFn([{}], {greetings: sayHello}, {macro: 'greetings'}, [], person), 'Hello John Doe!');
  t.end();
});

tap.test('should support a "term" attribute', t => {
  const locales = [{
    terms: [
      { name: 'greetings',
        form: 'long',
        value: ['Hello World!'] }
    ]
  }];

  t.is(textFn(locales, {}, {term: 'greetings'}, [], {}), 'Hello World!');
  t.end();
});

const supportDisplayAttr =
  property(genDisplayAttr, gen.asciiString.notEmpty(),
    (attr, str) => textFn([{}], {}, merge(attr, {value: 'foo'}), [], {})
      === toString(displayAttr(attr, output({}, 'a-node', 'foo'))));

tap.is(check(supportDisplayAttr).result, true,
  'supports "display" attribute.');
