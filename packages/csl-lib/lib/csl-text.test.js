var tap = require('tap');
var td = require('testdouble');
var textFn = require('./csl-text'); // Subject Under Test

tap.test('should support a "value" attribute', t => {
  var text = textFn({}, {});
  t.is(text({value: 'hello'}, [], {}), 'hello');
  t.end();
});

tap.test('should support a "variable" attribute', t => {
  var text = textFn({}, {});
  t.is(text({variable: 'message'}, [], {message: 'hello'}), 'hello');
  t.end();
});

tap.test('should support a "macros" attribute', t => {
  var person = {name: 'John Doe'};

  var sayHello = td.function();
  td.when(sayHello(person)).thenReturn(`Hello ${person.name}!`);

  var text = textFn(/* locales */{}, /* macros */{greetings: sayHello});
  t.is(text({macro: 'greetings'}, [], person), 'Hello John Doe!');
  t.end();
});

tap.test('should support a "term" attribute', t => {
  var text = textFn(/* locales */{
    terms: {
      greetings: [{
        name: 'greetings',
        single: 'Hello World!'
      }]
    }
  }, /* macros */{});
  t.is(text({term: 'greetings'}, [], {}), 'Hello World!');
  t.end();
});
