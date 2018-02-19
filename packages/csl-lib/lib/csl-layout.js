var R = require('ramda');
var assertChildren = require('./assert-children');
var constants = require('./constants');
var formattingAttr = require('./csl-attr-formatting');
var affixesAttr = require('./csl-attr-affixes');
var delimiterAttr = require('./csl-attr-delimiter');

function applyAttributes(attrs, out) {
  return R.pipe(
    delimiterAttr(attrs),
    formattingAttr(attrs),
    affixesAttr(attrs)
  )(out);
};

function layout(attrs, children, refs) {
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

  return applyAttributes(attrs, out);
};

module.exports = function (children, attrs) {
  assertChildren(children, [constants.CSL_NODE_TEXT]);
  var fn = layout.bind(null, attrs || {}, children);
  fn.type = constants.CSL_NODE_LAYOUT;
  return fn;
};
