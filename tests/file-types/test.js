import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test('file types - js mjs ts mts', async t => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        const all = await import('./foo/**/*.{mjs,mts,js,ts}')

        export default all
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
    default: {
      './foo/bar/baz.mjs': {
        default: 'baz',
        name: 'baz'
      },
      './foo/qux.mts': {
        default: 'qux',
        name: 'qux'
      },
      './foo/waldo.ts': {
        default: 'waldo',
        name: 'waldo'
      }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})
