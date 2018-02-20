var tap = require('tap');
var text = require('./csl-text'); // Subject Under Test

tap.is(text({value: 'hello'}, [], {}), 'hello', 'should return the value of the `value` attribute');
