var assertChildren = require('./assert-children');
var constants = require('./constants');

function applyAffixes(affixes, out) {
  var prefix = typeof affixes.prefix === 'undefined' ? '' : affixes.prefix;
  var suffix = typeof affixes.suffix === 'undefined' ? '' : affixes.suffix;
  return prefix + out + suffix;
}

function layout(opts, children, refs) {
  var out = refs.map(function (ref) {
    return children.map(function (child) {
      return child(ref);
    });
  });
  out = out.reduce(function (acc, res) {
    var str = res.join('');
    if (str) {
      acc.push(str);
    }
    return acc;
  }, []);
  out = out.join(opts.delimiter || '');
  return applyAffixes(opts, out);
};

module.exports = function (children, opts) {
  assertChildren(children, [constants.CSL_NODE_TEXT]);
  var fn = layout.bind(null, opts || {}, children);
  fn.type = constants.CSL_NODE_LAYOUT;
  return fn;
};
