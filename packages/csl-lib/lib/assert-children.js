function humanFriendlyJoin(arr) {
  return arr.length === 1 ?
    arr[0] :
    arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
}

function assertChildren(children, allowedChildren) {
  if (!Array.isArray(children)) throw new Error('Expected `children` to be an array');
  if (children.length === 0) throw new Error('Expected `children` to be a non-empty array');

  // All items must be functions.
  // Collect indexes where that is not the case.
  var errPos = children.reduce(function (acc, child, idx) {
    if (typeof child !== 'function') {
      acc.push(idx);
    }
    return acc;
  }, []);

  if (errPos.length > 0) {
    throw new Error('Unexpected non-function item(s) in `children` at position ' + humanFriendlyJoin(errPos));
  }

  // Build map of expected children types.
  // And collect indexes where items dont match.
  var expected = allowedChildren.reduce(function (obj, type) {
    obj[type] = true;
    return obj;
  }, {});

  var errPos = children.reduce(function (acc, child, idx) {
    if (!expected[child.type]) {
      acc.push(idx);
    }
    return acc;
  }, []);

  if (errPos.length > 0) {
    throw new Error('Unexpected item(s) in `children` at position ' + humanFriendlyJoin(errPos));
  }
}

module.exports = assertChildren;
