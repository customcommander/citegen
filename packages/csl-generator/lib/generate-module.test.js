const path = require('path');
const fs = require('fs');
const tap = require('tap');
const generateModule = require('./generate-module'); // SUT

tap.test('rejects when xml is broken',
  (t) => t.rejects(generateModule(`
    <broken
      <xml
  `))
);

tap.test('generates the csl processor code for given xml string', (t) => {
  const xml = `
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout>
          <text value="Hello World!"/>
        </layout>
      </citation>
    </style>
  `;

  generateModule(xml)
    .then(js => {
      const modulePath = path.resolve(__dirname, '..', 'tmp', 'generated_module.js');
      fs.writeFileSync(modulePath, js);
      const processor = require(modulePath);
      t.equals('Hello World!', processor.citation([{}]));
      t.end();
    })
    .catch((e) => {
      t.fail(e.message);
      t.end();
    });
});