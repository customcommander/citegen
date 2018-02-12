const {defineStep} = require('cucumber');
const assert = require('assert');
const generateModule = require('../helpers/generate-module');

defineStep(/^the following citation style$/, function (csl) {
  return generateModule(csl).then((modulePath) => {
    const style = require(modulePath);
    assert(style.citation([], {}) === 'this is a citation',
      `Module at '${modulePath}' failed to produce the correct citation`);
  });
});

defineStep(/^nothing$/, function () {
  console.log('noop');
});
