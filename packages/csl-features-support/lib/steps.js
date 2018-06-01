const {defineStep} = require('cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const {generateModule} = require('@customcommander/csl-generator');

const TMP_DIR = path.resolve(__dirname, '..', 'tmp');

defineStep(/^the following abbreviations$/, function (json) {
  this.abbrevs = JSON.parse(json);
});

defineStep(/^the following bibliographic entries$/, function (json) {
  this.bibentries = JSON.parse(json);
});

defineStep(/^the following bibliographic sections$/, function (json) {
  this.bibsections = JSON.parse(json);
});

defineStep(/^the following citations items$/, function (json) {
  this.citationitems = JSON.parse(json);
});

defineStep(/^the following citations$/, function (json) {
  this.citations = JSON.parse(json);
});

defineStep(/^the following citation style$/, function (csl) {
  return generateModule(csl).then((javascript) => {
    this.modulePath = `${TMP_DIR}/${uuid()}.js`;
    fs.writeFileSync(this.modulePath, javascript);
    this.style = require(this.modulePath);
  });
});

defineStep(/^the following data$/, function (json) {
  this.data = JSON.parse(json);
});

defineStep(/^the following additional data$/, function (json) {
  this.secondaryData = JSON.parse(json);
});

defineStep(/^the following options$/, function (json) {
  this.opts = JSON.parse(json);
});

defineStep(/^the following result is expected$/, function (result) {
  try {
    var out = this.style.citation(this.data);
    assert.equal(out, result);
  } catch (e) {
    assert.fail(
      `${this.modulePath}: ${e.message}` +
      `\n${e.stack}`
    );
  }
});
