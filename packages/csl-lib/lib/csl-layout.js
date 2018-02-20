var R = require('ramda');
var formattingAttr = require('./csl-attr-formatting');
var affixesAttr = require('./csl-attr-affixes');
var delimiterAttr = require('./csl-attr-delimiter');

function applyAttributes(attrs, results) {
  return R.pipe(
    delimiterAttr(attrs),
    formattingAttr(attrs),
    affixesAttr(attrs)
  )(results);
};

function applyChildren(children, refs) {
  var transducer = R.compose(
    R.map(R.of),
    R.map(R.ap(children)),
    R.map(R.join('')),
    R.map(R.ifElse(R.isEmpty, R.always([]), R.of))
  );
  return R.transduce(transducer, R.concat, [], refs);
}

function layout(attrs, children, refs) {
  var results = applyChildren(children, refs);
  return applyAttributes(attrs, results);
};

module.exports = function (children, attrs) {
  return layout.bind(null, attrs || {}, children);
};
