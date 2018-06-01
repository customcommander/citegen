const path = require('path');
const {spawn} = require('child_process');
const fs = require('fs');

const XSL_PATH = path.resolve(__dirname, 'module.xsl');

module.exports = (xml) => new Promise((resolve, reject) => {
  const xsltproc = spawn('xsltproc', [XSL_PATH, '-']);
  let xsltOut = '';
  let xsltErr = '';

  xsltproc.stderr.on('data', (data) => {
    xsltErr += data.toString();
  });

  xsltproc.stdout.on('data', (data) => {
    xsltOut += data.toString();
  });

  xsltproc.on('exit', (code) => {
    if (!code) {
      resolve(xsltOut);
    } else {
      reject(new Error(`xsltproc error ${code}: ${xsltErr}`));
    }
  });

  xsltproc.stdin.write(xml);
  xsltproc.stdin.end();
});
