import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test.serial('custom ignore - control', async t => {
  await testCase()

  const { default: actual } = await import('./dist/stdin.js?_=1')

  const expected = {
    default: {
      './foo/bar/baz.js': { default: 'baz', name: 'baz' },
      './foo/qux/grault.js': { default: 'grault', name: 'grault' },
      './foo/qux/waldo.js': { default: 'waldo', name: 'waldo' }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})

test.serial('custom ignore - ignores a single path', async t => {
  await testCase(['**/grault*'])

  const { default: actual } = await import('./dist/stdin.js?_=2')

  const expected = {
    default: {
      './foo/bar/baz.js': { default: 'baz', name: 'baz' },
      './foo/qux/waldo.js': { default: 'waldo', name: 'waldo' }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})

async function testCase (ignore) {
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
      subject({ ignore })
    ],
    target: 'node18'
  })
}
