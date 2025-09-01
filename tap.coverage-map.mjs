// Coverage map for tap: exclude the example CLI test from coverage
// Return [] for default coverage behavior on normal tests.
// Return null for the example CLI test to avoid including built example files.
export default function coverageMap(testFile) {
  if (
    typeof testFile === 'string' &&
    testFile.includes('test/example.events.test.ts')
  ) {
    // do not instrument any files for this test
    return null;
  }
  // Instrument TypeScript sources only; exclude built outputs
  return ['src/**/*.ts'];
}
