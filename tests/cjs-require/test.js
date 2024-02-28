import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test('cjs - require', async t => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        const all = require('./foo/**/*.js')

        module.exports = all
      `,
      resolveDir: __workdir
    },
    outdir: '../dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    plugins: [subject()],
    target: 'node18'
  })

  const { default: actual } = await import('./dist/stdin.js')

  const expected = {
    './foo/bar/baz.js': 'baz',
    './foo/qux.js': 'qux'
  }

  t.deepEqual(
    actual,
    expected
  )
})
