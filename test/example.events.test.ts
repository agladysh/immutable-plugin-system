import t from 'tap';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

t.test('events example prints expected output (CLI)', async (t) => {
  // Run example via its own package script to ensure it is a proper CLI
  const exampleDir = join(process.cwd(), 'examples/events');
  const { code, out } = await new Promise<{ code: number; out: string }>(
    (resolve) => {
      const entry = join(exampleDir, 'dist/main.js');
      const env: NodeJS.ProcessEnv = { PATH: process.env.PATH };
      const child = spawn(process.execPath, [entry], {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let out = '';
      child.stdout.on('data', (c) => (out += String(c)));
      child.stderr.on('data', (c) => (out += String(c)));
      child.on('close', (code) => resolve({ code: code ?? 0, out }));
    }
  );
  t.equal(code, 0, 'example exits with code 0');

  const expectedPath = join(process.cwd(), 'examples/events/expected.txt');
  const expectedLines = (await readFile(expectedPath, 'utf8'))
    .split(/\n/)
    .map((s) => s.trimEnd())
    .filter((l) => l.length > 0);

  const actualLines = out
    .split(/\n/)
    .map((s) => s.trimEnd())
    .filter((l) => l.length > 0);

  t.same(actualLines, expectedLines, 'example output matches expected.txt');
});
