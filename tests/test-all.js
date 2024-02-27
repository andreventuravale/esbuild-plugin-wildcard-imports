import * as esbuild from 'esbuild'
import assert from 'node:assert'
import { dirname, join } from 'node:path'
import wildImports from '../index.js'

const distdir = 'dist'

const entry = 'tests/esm-import-export/entry.js'

await esbuild.build({
  bundle: true,
  entryPoints: [entry],
  format: 'esm',
  outdir: join(distdir, dirname(entry)),
  platform: 'node',
  plugins: [wildImports()],
  target: 'node18'
})

const { default: actual } = await import(join('..', distdir, entry))

assert.deepStrictEqual(actual, {
  foo: { qux: {}, bar: { baz: {} } },
  './foo/qux.js': {},
  'foo/qux': {},
  './foo/bar/baz.js': {},
  'foo/bar/baz': {}
})
