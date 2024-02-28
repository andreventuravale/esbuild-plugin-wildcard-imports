import * as esbuild from 'esbuild'
import glob from 'fast-glob'
import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import wildImports from '../index.js'
import { debug } from '../util.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const entries = await glob(`**/${process.argv[2] ? `*${process.argv[2]}*/` : ''}actual.js`, {
  cwd: __dirname,
  ignore: ['**/dist', '**/node_modules']
})

let succeed = 0
let failed = 0

debug('Tests found:', entries)

for (const entry of entries) {
  console.time(entry)

  console.log('------------------------------------')

  const optionsPath = `./${join(dirname(entry), 'options.js')}`

  const outfile = `./${join(dirname(entry), '.actual.js')}`

  const pkgPath = join(__dirname, dirname(entry), 'package.json')

  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))

  const options = await import(optionsPath)

  let itFailed = true

  try {
    await esbuild.build({
      absWorkingDir: __dirname,
      bundle: true,
      entryPoints: [entry],
      format: pkg.type === 'module' ? 'esm' : 'cjs',
      outfile,
      platform: 'node',
      plugins: [wildImports(options.default ?? options)],
      target: 'node18'
    })

    const actualPath = `./${join(dirname(entry), '.actual.js')}`

    const actual = await import(actualPath)

    const messagePath = `./${join(dirname(entry), `message${extname(entry)}`)}`

    const message = await import(messagePath)

    const expectedPath = `./${join(dirname(entry), `expected${extname(entry)}`)}`

    const expected = await import(expectedPath)

    debug({ actual, expected })

    assert.deepStrictEqual(
      actual.default ?? actual,
      expected.default ?? expected,
      `The "${entry}" test failed${message.default ?? message ? `: ${message.default ?? message}` : ''}`
    )

    itFailed = false
  } catch (error) {
    console.error('Test error:', error.message)

    error.actual && console.error('Actual:', JSON.stringify(error.actual, null, 2))

    error.expected && console.error('Expected:', JSON.stringify(error.expected, null, 2))

    const errorsPath = `./${join(dirname(entry), `errors${extname(entry)}`)}`

    const { default: errors } = await import(errorsPath)

    if (errors && errors.some(message => error.message.includes(message))) {
      itFailed = false
    }
  } finally {
    if (itFailed) {
      failed++
    } else {
      succeed++
    }

    console.log(itFailed ? '❌' : '✅')

    console.timeEnd(entry)
  }
}

console.log('------------------------------------')

console.log(`Total  : ${entries.length}`)
console.log(`Succeed: ${succeed}`)
console.log(`Failed : ${failed}`)
