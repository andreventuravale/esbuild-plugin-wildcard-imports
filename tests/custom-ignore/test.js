import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

let sequence = 0

test.serial('custom ignore - control ( no ignore )', async t => {
  await testCase()

  const { default: actual } = await import(`./dist/stdin.js?_=${sequence++}`)

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

  const { default: actual } = await import(`./dist/stdin.js?_=${sequence++}`)

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

test.serial('custom ignore - ignores a many paths using a single pattern', async t => {
  await testCase(['**/{grault,waldo}*'])

  const { default: actual } = await import(`./dist/stdin.js?_=${sequence++}`)

  const expected = {
    default: {
      './foo/bar/baz.js': { default: 'baz', name: 'baz' }
    }
  }

  t.deepEqual(
    actual,
    expected
  )
})

test.serial('custom ignore - ignores a many paths using distinct patterns', async t => {
  await testCase(['**/baz*', '**/grault*'])

  const { default: actual } = await import(`./dist/stdin.js?_=${sequence++}`)

  const expected = {
    default: {
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
