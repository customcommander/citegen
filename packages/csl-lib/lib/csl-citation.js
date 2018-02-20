var R = require('ramda');

function citation (attrs, children, refs) {
  return children[0](refs);
};

module.exports = R.curry(function (attrs, children, refs) {
  return citation(attrs, children, refs);
});
