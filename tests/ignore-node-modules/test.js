import test from 'ava'
import * as esbuild from 'esbuild'
import glob from 'fast-glob'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test('ignore node_modules', async t => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        import * as all from './foo/**/*.js'

        export default all
      `,
      resolveDir: __workdir
    },
    outdir: '../dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    plugins: [
      subject()
    ],
    target: 'node18'
  })

  t.true(
    (await glob('**/*', { cwd: __workdir }))
      .includes(
        'foo/qux/node_modules/waldo.js'
      ),
    'there should be node_modules path in the fixtures'
  )

  const { default: actual } = await import('./dist/stdin.js')

  const expected = {
    default: {
      './foo/bar/baz/qux.js': {
        default: 'qux',
        name: 'qux'
      }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})
