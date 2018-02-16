var assertChildren = require('./assert-children');
var constants = require('./constants');

function layout(opts, children, refs) {
  var out = refs.map(function (ref) {
    return children.map(function (child) {
      return child(ref);
    });
  });
  out = out.reduce(function (acc, res) {
    var str = res.filter(function (s) {
      return s !== '';
    });
    str = str.join('');
    if (str) {
      acc.push(str);
    }
    return acc;
  }, []);
  out = out.join(opts.delimiter || '');
  var prefix = typeof opts.prefix === 'undefined' ? '' : opts.prefix;
  var suffix = typeof opts.suffix === 'undefined' ? '' : opts.suffix;
  return prefix + out + suffix;
};

module.exports = function (children, opts) {
  assertChildren(children, [constants.CSL_NODE_TEXT]);
  var fn = layout.bind(null, opts || {}, children);
  fn.type = constants.CSL_NODE_LAYOUT;
  return fn;
};
