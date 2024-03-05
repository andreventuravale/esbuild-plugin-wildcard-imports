const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('export aggregation with alias', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        export * as foo from './foo/**/*.js'
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
    foo: {
      './foo/bar/baz.js': {
        default: 'baz',
        name: 'baz'
      },
      default: {
        './foo/bar/baz.js': {
          default: 'baz',
          name: 'baz'
        }
      }
    }
  }

  t.deepEqual(actual, expected)
})
