const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('ignores non-bundles', async (t) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    entryPoints: ['input.js'],
    outdir: 'dist',
    bundle: false,
    format: 'cjs',
    platform: 'node',
    plugins: [subject()],
    target: 'node18'
  })

  await t.throwsAsync(async () => require(`${__workdir}/dist/input.js`), {
    message: /Cannot find module/
  })
})
