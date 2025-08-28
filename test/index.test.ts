import { test } from 'tap';
import type { PluginURN } from '../src/index.js';

test('types are exported', (t) => {
  t.ok(true, 'types imported without error');
  t.end();
});

test('PluginURN is string type', (t) => {
  const urn: PluginURN = 'test-plugin';
  t.equal(typeof urn, 'string', 'PluginURN should be assignable from string');
  t.end();
});
