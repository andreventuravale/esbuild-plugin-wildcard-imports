import * as esbuild from 'esbuild'
import assert from 'node:assert'
import { dirname, join } from 'node:path'
import wildImports from '../index.js'

const distdir = 'dist'

const entry = 'tests/esm/entry.js'

await esbuild.build({
  bundle: true,
  entryPoints: [entry],
  format: 'esm',
  outdir: join(distdir, dirname(entry)),
  platform: 'node',
  plugins: [wildImports()],
  target: 'node18'
})

const actual = await import(join('..', distdir, entry))

assert.deepStrictEqual(actual, {})
