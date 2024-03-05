const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('dynamic imports', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    entryPoints: ['input.js'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    plugins: [subject()],
    target: 'node18'
  })

  const { default: actual } = await import(`${__workdir}/dist/input.js`)

  const expected = {
    default: {
      './foo/bar/baz.js': { default: 'baz', name: 'baz' },
      './foo/qux.js': { default: 'qux', name: 'qux' }
    }
  }

  t.deepEqual(actual, expected)
})
