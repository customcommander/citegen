const path = require('path');
const {spawn} = require('child_process');
const uuid = require('uuid/v4');

module.exports = function generateModule(csl) {
  return new Promise((resolve, reject) => {
    const modulePath = path.resolve(__dirname, '..', '..', 'tmp', `${uuid()}.js`);
    const xsltArgs = ['-o', modulePath, './lib/module.xsl', '-'];
    const procArgs = {cwd: path.resolve(__dirname, '..', '..')};

    const proc = spawn('xsltproc', xsltArgs, procArgs);

    proc.on('error', function () {
      reject(new Error('cannot generate module for given csl'));
    });

    proc.on('exit', function (code) {
      if (!code) {
        resolve(modulePath);
      } else {
        reject(new Error('an error has occured while transforming csl'));
      }
    });

    proc.stdin.write(csl);
    proc.stdin.end();
  });
};
