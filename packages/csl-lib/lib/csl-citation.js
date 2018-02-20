function citation (refs, children) {
  return children[0](refs);
};

module.exports = function (refs, children) {
  return citation(refs, children);
};
