import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

test('(limitation) require.resolve is not supported', async t => {
  await t.throwsAsync(async () => {
    await esbuild.build({
      absWorkingDir: __workdir,
      stdin: {
        contents: `
          const all = require.resolve('./foo/**/*.js')
  
          module.exports = all      
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
  }, {
    message: /Cannot resolve paths whose kind is "require-resolve"/
  })
})
