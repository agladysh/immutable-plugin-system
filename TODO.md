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
- [ ] Identify and clean up any transient change history comments in the code,
      and similar AI-generated crud
- [ ] Run `vibe-check` and skeptically triage its output
- [ ] Rigorously review the code, examples, and tests
- [ ] Generate documentation
- [ ] Write [README.md](README.md)
- [ ] Write [examples/README.md](examples/README.md)
- [ ] Setup GH pages with hook on tag push
- [ ] Setup GH npm publish hook on tag push
- [ ] Setup GH release on tag push
- [ ] Prepare release 1.0.0-rc1 with proper [CHANGELOG.md](CHANGELOG.md)
- [ ] Tag v1.0.0-rc1 with -m from [CHANGELOG.md](CHANGELOG.md) entry
