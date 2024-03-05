const { join } = require('node:path')
const { resolveAll } = require('../../util.js')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('import and re-export', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        import foo from './foo/**/*.js'

        export { foo }
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

  const { default: imported } = await import('./dist/stdin.js')

  const actual = await resolveAll(imported)

  const expected = {
    foo: {
      './foo/bar/baz.js': {
        default: 'baz',
        name: 'baz'
      },
      './foo/qux.js': {
        default: 'qux',
        name: 'qux'
      }
    }
  }

  t.deepEqual(actual, expected)
})
