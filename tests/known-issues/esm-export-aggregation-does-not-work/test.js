import test from 'ava'
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subject from '../../../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const __workdir = join(__dirname, 'fixtures')

let sequence = 0

test('"export * from" aggregations does not work', async t => {
  const pattern = '\'./foo/**/*.js\''

  const expected = {
    default: {
      './foo/bar/baz.js': {
        default: 'baz',
        name: 'baz'
      },
      './foo/qux/waldo.js': {
        default: 'waldo',
        name: 'waldo'
      }
    }
  }

  /**
   * The control.
   *
   * To demonstrate how it works an import followed by a export.
   *
   * An `import agg from` followed by a `export default agg`,
   * are semantically equivalent.
   */
  await reproduce(t, expected)(`
    import aggregation from ${pattern}

    export default aggregation
  `)

  /**
   * Actual issue proof.
   *
   * Expected if not an issue: Same as the control.
   *
   * Expected as currently stands: Returns an empty object.
   *
   * Cause: under investigation
   */
  await reproduce(t, {})(`
    export * from ${pattern}
  `)
})

const reproduce = (t, expected) => async (contents) => {
  await esbuild.build({
    absWorkingDir: __workdir,
    stdin: {
      contents,
      resolveDir: __workdir
    },
    outdir: '../dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    plugins: [subject()],
    target: 'node18'
  })

  const { ...actual } = await import(`./dist/stdin.js?_=${sequence++}`)

  t.deepEqual(
    actual,
    expected
  )
}
