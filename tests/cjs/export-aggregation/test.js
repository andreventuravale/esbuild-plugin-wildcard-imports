const { join } = require('node:path')
const { resolveAll } = require('../../util.js')
const esbuild = require('esbuild')
const subject = require('../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

let sequence = 0

test('export aggregation', async (t) => {
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

  const { default: imported } = await import(`./dist/stdin.js?_=${sequence++}`)

  const actual = await resolveAll(imported)

  t.deepEqual(actual, {
    './foo/bar/baz.js': {
      default: 'baz',
      name: 'baz'
    },
    './foo/qux/waldo.js': {
      default: 'waldo',
      name: 'waldo'
    }
  })
})
