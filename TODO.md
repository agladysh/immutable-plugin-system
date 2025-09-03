# TODO

- [x] Finish [spec](docs/spec.md)
- [x] Rigorously review the [spec](docs/spec.md)
- [x] Bump the [spec](docs/spec.md) to v1.0.0, r1.0.0
- [x] Add pre-made code infrastructure files, and GH funding
- [x] Add minimal stubs for code and tests
- [x] Configure [package.json](package.json)
- [x] Run lint and tests
- [x] Squash to initial commit
- [x] Document explicitly (v1.1.0/r1.1.1) and test that plugins are allowed to
      omit any or all entity types (the `entities` key remains mandatory, its
      fields may be declared as optional in the concrete `Entities` type). Add a
      test that checks if plugin does not provide a required type, it is not a
      valid plugin (works at runtime only if more than one plugin is provided,
      of course).
- [x] Migrate guard-adjascent tests (validation checks) to guards from tests for
      code that uses them. Control for redundancy and nuance: no test
      duplication, but all nuances covered.
- [x] Split `guards.ts` (and tests) to files in `guards/` by topic due to its
      size.
- [x] Rename implementation files (and their tests) so they match what they
      export (e.g. `ImmutableEntityCollection.ts`). `types.ts` remains.
- [x] Amend spec (v1.1.0/r1.1.2) to require rigorous `tsd` tests.
- [x] tsd works with built project, add pnpm -s build to pretest:tsd
- [x] Implement rigorous `tsd` tests.
- [x] Amend spec (v1.1.1/r1.1.3) to forbid empty string as plugin name. Refine
      implementation, tsd and tap tests to support.
- [x] Add GH CI hook
- [x] Figure out and document position on individual asset immutability: (a) out
      of scope, (b) by convention (integrations must guarantee, we do not
      check), (c) we enforce, (d) other
- [x] Implement code, example and tests, all with rigorous inline documentation
- [x] Run `~/.cargo/bin/similarity-ts` and fix reports
- [x] Identify and clean up any transient change history comments in the code,
      and similar AI-generated crud
- [x] Run `vibe-check` and skeptically triage its output
- [x] Rigorously review the code, examples, and tests
- [x] Generate JSDoc documentation. Pick modern generator that ideally would
      give us Markdown in `docs/` as well as a GitHub pages website later (see
      below).
- [x] Add and configure `typedoc-plugin-coverage`.
- [x] Switch to TSDoc, update comment syntax, replace all JSDoc mentions (except
      in this file above) to TSDoc, configure strict `eslint-plugin-tsdoc`, and
      fix any violations.
- [x] Move `./tap.coverage-map.mjs` to `scripts/`
- [x] Write rigorous [README.md](README.md)
- [x] Add documentation coverage badge `docs/api/coverage.svg` to
      [README.md](README.md)
- [x] Add test coverage badge to [README.md](README.md)
- [x] Add CI badge to [README.md](README.md)
- [x] Add TypeScript badge to [README.md](README.md)
- [x] Write rigorous [examples/README.md](examples/README.md)
- [x] Setup GH pages with hook on master push
- [ ] Setup GH npm publish hook on tag push
- [ ] Setup GH release on tag push
- [ ] Consider to lower Node version in package.json, if code allows
- [ ] Switch GH pages hook to tag push only
- [ ] Prepare `package.json` for publication, enable using other package
      managers on installation
- [ ] Prepare release 1.0.0-rc1 with proper [CHANGELOG.md](CHANGELOG.md)
- [ ] Tag v1.0.0-rc1 with -m from [CHANGELOG.md](CHANGELOG.md) entry
