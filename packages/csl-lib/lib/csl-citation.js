var constants = require('./constants');
var assertChildren = require('./assert-children');

function citation (refs, children) {
  return children[0](refs);
};

module.exports = function (refs, children) {
  assertChildren(children, [constants.CSL_NODE_LAYOUT]);
  return citation(refs, children);
};
