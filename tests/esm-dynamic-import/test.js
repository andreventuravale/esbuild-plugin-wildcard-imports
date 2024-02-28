import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

test('dynamic imports', async t => {
  await esbuild.build({
    absWorkingDir: join(__dirname, 'fixtures'),
    bundle: true,
    entryPoints: ['./actual.js'],
    format: 'esm',
    outdir: '../dist',
    platform: 'node',
    plugins: [subject()],
    target: 'node18'
  })

  const { default: actual } = await import('./dist/actual.js')

  const expected = {
    default: {
      './foo/bar/baz.js': { default: 'baz', name: 'baz' },
      './foo/qux.js': { default: 'qux', name: 'qux' }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})
