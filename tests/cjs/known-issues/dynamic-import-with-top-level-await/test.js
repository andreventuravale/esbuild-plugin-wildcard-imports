const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

test('dynamic import with top-level await does not work', async (t) => {
  await t.throwsAsync(
    async () => {
      await esbuild.build({
        absWorkingDir: __workdir,
        entryPoints: ['input.js'],
        outdir: 'dist',
        bundle: true,
        format: 'cjs',
        platform: 'node',
        plugins: [subject()],
        target: 'node18'
      })
    },
    {
      message:
        /ERROR: Top-level await is currently not supported with the "cjs" output format/
    }
  )
})
