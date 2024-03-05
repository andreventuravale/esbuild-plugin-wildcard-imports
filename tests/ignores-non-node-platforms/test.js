const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('ignores non-node platforms', async (t) => {
  await t.throwsAsync(
    async () => {
      await esbuild.build({
        absWorkingDir: __workdir,
        entryPoints: ['input.js'],
        outdir: 'dist',
        bundle: true,
        format: 'cjs',
        platform: 'browser',
        plugins: [subject()],
        target: 'node18'
      })
    },
    { message: /Could not resolve/ }
  )
})
