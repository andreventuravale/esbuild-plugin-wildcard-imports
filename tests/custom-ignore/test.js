const { join } = require('node:path')
const esbuild = require('esbuild')
const subject = require('../../index.js')
const test = require('ava')

const __workdir = join(__dirname, 'fixtures')

let sequence = 0

test.afterEach(() => {
  sequence++
})

test.serial('custom ignore - control ( no ignore )', async (t) => {
  await testCase()

  const { default: actual } = await import(`./dist/${sequence}/stdin.js`)

  const expected = {
    './foo/bar/baz.js': {
      default: 'baz',
      name: 'baz'
    },
    './foo/qux/grault.js': {
      default: 'grault',
      name: 'grault'
    },
    './foo/qux/waldo.js': {
      default: 'waldo',
      name: 'waldo'
    }
  }

  t.deepEqual(actual, expected)
})

test.serial('custom ignore - ignores a single path', async (t) => {
  await testCase(['**/grault*'])

  const { default: actual } = await import(`./dist/${sequence}/stdin.js`)

  const expected = {
    './foo/bar/baz.js': {
      default: 'baz',
      name: 'baz'
    },
    './foo/qux/waldo.js': {
      default: 'waldo',
      name: 'waldo'
    }
  }

  t.deepEqual(actual, expected)
})

test.serial(
  'custom ignore - ignores a many paths using a single pattern',
  async (t) => {
    await testCase(['**/{grault,waldo}*'])

    const { default: actual } = await import(`./dist/${sequence}/stdin.js`)

    const expected = {
      './foo/bar/baz.js': {
        default: 'baz',
        name: 'baz'
      }
    }

    t.deepEqual(actual, expected)
  }
)

test.serial(
  'custom ignore - ignores a many paths using distinct patterns',
  async (t) => {
    await testCase(['**/baz*', '**/grault*'])

    const { default: actual } = await import(`./dist/${sequence}/stdin.js`)

    const expected = {
      './foo/qux/waldo.js': {
        default: 'waldo',
        name: 'waldo'
      }
    }

    t.deepEqual(actual, expected)
  }
)

async function testCase(ignore, format = 'cjs') {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents: `
        export * from './foo/**/*.js'
      `,
      resolveDir: __workdir
    },
    outdir: `../dist/${sequence}`,
    bundle: true,
    format,
    platform: 'node',
    plugins: [subject({ ignore })],
    target: 'node18'
  })
}
