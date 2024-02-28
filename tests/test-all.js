import * as esbuild from 'esbuild'
import glob from 'fast-glob'
import assert from 'node:assert'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import wildImports from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __distdir = join(__dirname, 'dist')

const entries = await glob('**/actual.js', {
  cwd: __dirname,
  ignore: ['**/dist', '**/node_modules']
})

console.log(entries)

await esbuild.build({
  absWorkingDir: __dirname,
  bundle: true,
  entryPoints: entries,
  format: 'esm',
  outdir: __distdir,
  platform: 'node',
  plugins: [wildImports()],
  target: 'node18'
})

for (const entry of entries) {
  const actualPath = `./${relative(__dirname, join(__distdir, entry))}`

  const { default: actual } = await import(actualPath)

  const expectedPath = `./${join(dirname(entry), `expected${extname(entry)}`)}`

  const { default: expected } = await import(expectedPath)

  console.log({ actual, expected })

  assert.deepStrictEqual(
    actual,
    expected,
    `Failed: ${entry}`
  )
}
