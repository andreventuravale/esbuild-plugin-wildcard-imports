const { join } = require('node:path')
const { eagerLoad } = require('../../util.js')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('file types - js mjs ts mts', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        export * from './foo/**/*.{mjs,mts,js,ts}'
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

  const actual = await eagerLoad(imported)

  const expected = {
    './foo/bar/baz.mjs': {
      default: 'baz',
      name: 'baz'
    },
    './foo/qux.mts': {
      default: 'qux',
      name: 'qux'
    },
    './foo/waldo.ts': {
      default: 'waldo',
      name: 'waldo'
    }
  }

  t.deepEqual(actual, expected)
})
