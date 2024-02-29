import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test('(known issue) nested use of wildcard imports are not working', async t => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        import all from './foo/**/*.js'

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
    './foo/bar/baz/qux.js': {
      default: 'qux',
      name: 'qux'
    },
    './foo/bar/index.js': {
      default: {
        default: {
          './baz/qux.js': {
            default: 'qux',
            name: 'qux'
          }
        }
      }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})
