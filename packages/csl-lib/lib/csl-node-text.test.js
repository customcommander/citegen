const R = require('ramda');
const tap = require('tap');
const {gen, check, property} = require('testcheck');
const td = require('testdouble');
const genDisplayAttr = require('../generators/attr-display');
const displayAttr = require('./csl-attr-display');
const textFn = require('./csl-node-text'); // Subject Under Test

tap.test('should support a "value" attribute', t => {
  var text = textFn(/* locales */[{}], {});
  t.is(text({value: 'hello'}, [], {}), 'hello');
  t.end();
});

tap.test('should support a "variable" attribute', t => {
  var text = textFn(/* locales */[{}], {});
  t.is(text({variable: 'message'}, [], {message: 'hello'}), 'hello');
  t.end();
});

tap.test('should support a "macros" attribute', t => {
  var person = {name: 'John Doe'};

  var sayHello = td.function();
  td.when(sayHello(person)).thenReturn(`Hello ${person.name}!`);

  var text = textFn(/* locales */[{}], /* macros */{greetings: sayHello});
  t.is(text({macro: 'greetings'}, [], person), 'Hello John Doe!');
  t.end();
});

tap.test('should support a "term" attribute', t => {
  var text = textFn(/* locales */[{
    terms: [
      { name: 'greetings',
        single: 'Hello World!' }
    ]
  }], /* macros */{});
  t.is(text({term: 'greetings'}, [], {}), 'Hello World!');
  t.end();
});

const supportDisplayAttr =
  property(genDisplayAttr, gen.asciiString.notEmpty(),
    (attr, str) => textFn(/* locales */[{}], {}, R.merge(attr, {value: 'foo'}), [], {}) === displayAttr(attr, 'foo'));

tap.is(check(supportDisplayAttr).result, true,
  'supports "display" attribute.');
