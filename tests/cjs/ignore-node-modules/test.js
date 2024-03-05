const { glob } = require('fast-glob')
const { join } = require('node:path')
const { eagerLoad } = require('../../util.js')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('ignore node_modules', async (t) => {
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

  t.true(
    (await glob('**/*', { cwd: __workdir })).includes(
      'foo/qux/node_modules/waldo.js'
    ),
    'there should be node_modules path in the fixtures'
  )

  const { default: imported } = await import('./dist/stdin.js')

  const actual = await eagerLoad(imported)

  const expected = {
    './foo/bar/baz/qux.js': {
      default: 'qux',
      name: 'qux'
    }
  }

  t.deepEqual(actual, expected)
})
