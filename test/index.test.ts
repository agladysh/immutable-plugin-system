import { test } from 'tap';
import { stub_delete_me } from '../src/index.js';

test('stub export exists and has correct value', (t) => {
  t.equal(stub_delete_me, 42, 'stub_delete_me should equal 42');
  t.end();
});

test('stub export has correct type', (t) => {
  t.equal(typeof stub_delete_me, 'number', 'stub_delete_me should be a number');
  t.end();
});
