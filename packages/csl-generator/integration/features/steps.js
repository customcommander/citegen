const {defineStep} = require('cucumber');
const assert = require('assert');
const generateModule = require('../helpers/generate-module');

defineStep(/^the following citation style$/, function (csl) {
  return generateModule(csl).then((modulePath) => {
    this.modulePath = modulePath;
    this.style = require(modulePath);
  });
});

defineStep(/^the following documents?$/, function (json) {
  this.docs = JSON.parse(json);
});

defineStep(/^I expect the following citation$/, function (citation) {
  try {
    var out = this.style.citation(this.docs);
  } catch (e) {
    console.error(`Error thrown in generated CSL module at ${this.modulePath}`);
    throw e;
  }
  assert.equal(out, citation);
});
