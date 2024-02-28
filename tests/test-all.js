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

assert.deepStrictEqual(
  actual,
  {
    foo: {
      index: { bar: 'bar from index', name: 'foo' },
      qux: { default: 'qux', name: 'qux' },
      bar: { baz: { default: 'baz', name: 'baz' } }
    },
    './foo/index.js': { bar: 'bar from index', name: 'foo' },
    'foo/index': { bar: 'bar from index', name: 'foo' },
    './foo/qux.js': { default: 'qux', name: 'qux' },
    'foo/qux': { default: 'qux', name: 'qux' },
    './foo/bar/baz.js': { default: 'baz', name: 'baz' },
    'foo/bar/baz': { default: 'baz', name: 'baz' }
  }
)
