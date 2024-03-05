const { join } = require('node:path')
const { resolveAll } = require('../../util.js')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('require', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        module.exports = require('./foo/**/*.js')
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
    './foo/bar/baz.js': 'baz',
    './foo/qux.js': 'qux'
  }

  t.deepEqual(actual, expected)
})
