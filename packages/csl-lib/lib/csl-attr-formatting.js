var R = require('ramda');

var generateStyle = R.pipe(
  R.pick(['font-style', 'font-variant', 'font-weight', 'text-decoration', 'vertical-align']),
  R.toPairs,
  R.map(R.join(':')),
  R.join(';')
);

function applyStyle(style, str) {
  return '<span style="' + style + '">' + str + '</span>';
}

module.exports = R.curry(function (attrs, str) {
  var style = generateStyle(attrs);
  return (str === '' || style === '') ? str : applyStyle(style, str);
});
