const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('nested import and re-export', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        export * from './foo/**/*.js'
      `,
      resolveDir: __workdir
    },
    outdir: '../dist',
    bundle: true,
    format: 'cjs',
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
      baz: {
        './baz/qux.js': {
          default: 'qux',
          name: 'qux'
        }
      }
    }
  }

  t.deepEqual(actual, expected)
})
