import test from 'tape'
import {generateCitation} from "../build/academy-of-management-review.js";

test('returns a string', t => {
  t.is(generateCitation(), 'this is a citation');
  t.end();
})
