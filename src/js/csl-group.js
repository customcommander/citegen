export default function (ref, fns, opts, refs) {
  const {
    prefix = '',
    suffix = '',
    delimiter = ''
  } = opts;

  const parts = fns.reduce((arr, fn) => {
    if (arr === null) return [].concat(fn() || []);
    if (arr.length === 0) return [];
    const part = fn();
    return part === '' ? [] : arr.concat(part);
  }, null);

  return parts.length === 0 ? '' : `${prefix}${parts.join(delimiter)}${suffix}`;
}
