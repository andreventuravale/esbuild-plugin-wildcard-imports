import * as esbuild from 'esbuild'
import glob from 'fast-glob'
import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import wildImports from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const entries = await glob('**/actual.js', {
  cwd: __dirname,
  ignore: ['**/dist', '**/node_modules']
})

for (const entry of entries) {
  const actualPath = `./${join(dirname(entry), '.actual.js')}`

  const expectedPath = `./${join(dirname(entry), `expected${extname(entry)}`)}`

  const setupPath = `./${join(dirname(entry), 'setup.js')}`

  const outfile = `./${join(dirname(entry), '.actual.js')}`

  const pkgPath = join(__dirname, dirname(entry), 'package.json')

  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))

  const setup = await import(setupPath)

  await esbuild.build({
    absWorkingDir: __dirname,
    bundle: true,
    entryPoints: [entry],
    format: pkg.type === 'module' ? 'esm' : 'cjs',
    outfile,
    platform: 'node',
    plugins: [wildImports(setup.default ?? setup)],
    target: 'node18'
  })

  const actual = await import(actualPath)

  const expected = await import(expectedPath)

  assert.deepStrictEqual(
    actual.default ?? actual,
    expected.default ?? expected,
    `Failed: ${entry}`
  )
}
