const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('cjs - require', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        const all = require('./foo/**/*.js')

        module.exports = all
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
    './foo/bar/baz.js': 'baz',
    './foo/qux.js': 'qux'
  }

  t.deepEqual(actual, expected)
})

test('cjs - require', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        const all = require('./foo/**/*.js')

        module.exports = all
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
    './foo/bar/baz.js': 'baz',
    './foo/qux.js': 'qux'
  }

  t.deepEqual(actual, expected)
})
