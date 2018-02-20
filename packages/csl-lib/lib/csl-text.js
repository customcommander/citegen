function text(opts) {
  return opts.value;
}

module.exports = function (opts) {
  return text.bind(null, opts);
};