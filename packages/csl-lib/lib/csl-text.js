var constants = require('./constants');

function text(opts) {
  return opts.value;
}

module.exports = function (opts) {
  var fn = text.bind(null, opts);
  fn.type = constants.CSL_NODE_TEXT;
  return fn;
};