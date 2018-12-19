var R = require('ramda');

var klassMap = {
  'block': 'csl-display-line',
  'left-margin': 'csl-display-col1',
  'right-inline': 'csl-display-col2',
  'indent': 'csl-display-indent'
};

/**
 * Wrap `str` within a <div>.
 *
 * @example
 * wrap('foo', 'bar'); // '<div class="foo">bar</div>
 *
 * @private
 * @function
 * @param {string} klass - A CSS class name. See `klassMap`.
 * @param {string} str - The string to wrap
 * @return {string}
 */
var wrap = R.curry(function (klass, str) {
  return '<div class="' + klass + '">' + str + '</div>';
});

/**
 * Gets appropriate wrapper for given `display`.
 *
 * @example
 * var wrapper = getWrapper('block');
 * wrapper('foo'); // '<div class="csl-display-line">foo</div>'
 *
 * @private
 * @function
 * @param {string} display - The value of the CSL display attribute.
 * @return {function}
 */
var getWrapper = R.ifElse(
  R.has(R.__, klassMap),
  R.pipe(R.prop(R.__, klassMap), wrap),
  R.always(R.identity)
);

module.exports = R.curry(function (attrs, str) {
  var display = R.propOr('', 'display', attrs);
  var displayWrapper = getWrapper(display);
  return displayWrapper(str);
});
