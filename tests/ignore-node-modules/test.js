const { glob } = require('fast-glob')
const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('ignore node_modules', async (t) => {
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

  t.true(
    (await glob('**/*', { cwd: __workdir })).includes(
      'foo/qux/node_modules/waldo.js'
    ),
    'there should be node_modules path in the fixtures'
  )

  const { default: actual } = await import('./dist/stdin.js')

  const expected = {
    './foo/bar/baz/qux.js': {
      default: 'qux',
      name: 'qux'
    }
  }

  t.deepEqual(actual, expected)
})
