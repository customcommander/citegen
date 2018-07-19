const R = require('ramda');
const tap = require('tap');
const td = require('testdouble');
const genChooseCondition = require('./generators/choose-condition');
const genNumber = require('./generators/number');
const {check, property, sampleOne} = require('testcheck');
const ifFn = require('./csl-node-if'); // Subject Under Test

const matchCond = R.propOr('all', 'match');
const splitAttr = R.pipe(R.propOr(''), R.split(' '), R.reject(R.isEmpty));
const wontMatch = R.pipe(R.map(R.objOf(R.__, 'NaN')), R.mergeAll);
const willMatch = R.pipe(R.map(R.objOf(R.__, sampleOne(genNumber.any))), R.mergeAll);

function generateMatchingTypeProp(attrs) {
  const prop = R.objOf('type');
  const types = splitAttr('type', attrs);
  const match = matchCond(attrs);
  if (types.length === 0) return {};
  if (types.length > 1 && match === 'all') return null;
  if (match === 'none') return prop('fake_type');
  return prop(R.last(types));
}

function generateMatchingNumberProp(attrs) {
  const numbers = splitAttr('is-numeric', attrs);
  const match = matchCond(attrs);
  if (numbers.length === 0) return {};
  if (match === 'none') return wontMatch(numbers);
  if (match === 'all') return willMatch(numbers);
  return R.apply(R.useWith(R.merge, [wontMatch, willMatch]), R.splitAt(-1, numbers));
}

function generateNonMatchingTypeProp(attrs) {
  const prop = R.objOf('type');
  const match = matchCond(attrs);
  const types = splitAttr('type', attrs);
  if (types.length === 0) return {};
  if (match === 'none') return prop(R.last(types));
  return prop('fake_type');
}

function generateNonMatchingNumberProp(attrs) {
  const numbers = splitAttr('is-numeric', attrs);
  const match = matchCond(attrs);
  if (numbers.length === 0) return {};
  if (match === 'none') return willMatch(numbers);
  return wontMatch(numbers);
}

function generateReference(propBuilders, attrs) {
  const props = R.juxt(propBuilders)(attrs);
  return R.ifElse(R.any(R.isNil), R.always(null), R.mergeAll)(props);
}

function generateMatchingReference(attrs) {
  return generateReference([
    generateMatchingTypeProp,
    generateMatchingNumberProp], attrs);
}

function generateNonMatchingReference(attrs) {
  return generateReference([
    generateNonMatchingTypeProp,
    generateNonMatchingNumberProp], attrs);
}

const applyChildrenWhenTrue = property(genChooseCondition,
  (attrs) => {
    const ref = generateMatchingReference(attrs);
    const fn = td.function();
    td.when(fn(ref)).thenReturn('ok');
    return ref === null ? true : ifFn({}, {}, attrs, [fn, fn], ref) === 'okok';
  });

tap.is(check(applyChildrenWhenTrue).result, true,
  'return children output when conditions are satisfied.');

const returnEmptyStringWhenFalse = property(genChooseCondition,
  (attrs) => {
    const ref = generateNonMatchingReference(attrs);
    return ifFn({}, {}, attrs, [], ref) === '';
  });

tap.is(check(returnEmptyStringWhenFalse).result, true,
  'return an empty string when the conditions are not satisfied.');
