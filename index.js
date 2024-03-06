const glob = require('fast-glob')
const { createHash } = require('node:crypto')
const { relative } = require('node:path')
const { debug } = require('./util.js')

const name = 'wildcard-imports'

module.exports = function ({ ignore = [] } = {}) {
  return {
    name,
    setup (build) {
      const { bundle, format = 'cjs', platform } = build.initialOptions

      const isCjs = format === 'cjs'

      debug({ bundle, isCjs, format })

      build.onResolve(
        { filter: /[?+*{}[\]()]/ },
        ({ importer, kind, path, resolveDir }) => {
          if (platform !== 'node') {
            return
          }

          debug({ kind })

          switch (kind) {
            case 'dynamic-import':
            case 'import-statement':
            case 'require-call':
              return {
                namespace: name,
                path,
                pluginData: {
                  importer,
                  kind,
                  resolveDir
                }
              }
          }
        }
      )

      build.onLoad(
        { filter: /.*/, namespace: name },
        async ({ path, pluginData: { importer, kind, resolveDir } }) => {
          const allFiles = await glob(path, {
            absolute: true,
            cwd: resolveDir,
            ignore: ['**/node_modules', ...ignore]
          })

          const targetFiles = allFiles
            .filter((path) => path !== importer)
            .map((path) => relative(resolveDir, path))

          const exports = {}

          const contents = [
            '',
            targetFiles.map((path) => {
              const key = createHash('md5').update(path).digest('hex')

              const alias = `_${key}`

              exports[`./${path}`] = alias

              return [
                kind === 'dynamic-import' &&
                  `const ${alias} = ['./${path}', async () => ${isCjs ? 'require' : 'await import'}('./${path}')]`,

                ((kind === 'import-statement' && !isCjs) ||
                  (kind === 'require-call' && !isCjs)) &&
                  `const { default: ${alias} } = async () => import('./${path}');`,

                ((kind === 'import-statement' && isCjs) ||
                  (kind === 'require-call' && isCjs)) &&
                  `const ${alias} = async () => require('./${path}');`
              ]
            }),
            '',
            (() => {
              const stringified = JSON.stringify(exports, null, 2)

              const fragment = stringified.replace(
                /"(_[0-9a-f]+)"/g,
                (_, alias) => alias
              )

              return [
                kind === 'dynamic-import' &&
                  `${isCjs ? 'module.exports =' : 'export default'} Object.fromEntries([${Object.values(exports).join(', ')}])`,

                ((kind === 'import-statement' && !isCjs) ||
                  (kind === 'require-call' && !isCjs)) &&
                  `export default ${fragment};`,

                ((kind === 'import-statement' && isCjs) ||
                  (kind === 'require-call' && isCjs)) &&
                  `module.exports = ${fragment};`
              ]
            })(),
            ''
          ]
            .flat(Number.MAX_SAFE_INTEGER)
            .filter((line) => typeof line === 'string')
            .join('\n')

          debug({ importer, contents })

          return {
            contents,
            resolveDir
          }
        }
      )
    }
  }
}
