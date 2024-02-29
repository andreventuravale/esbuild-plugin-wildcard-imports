import glob from 'fast-glob'
import { createHash } from 'node:crypto'
import { relative } from 'node:path'
import { debug } from './util.js'

const name = 'wildcard-imports'

export default function ({ ignore = [] } = {}) {
  return {
    name,
    setup (build) {
      build.onResolve({ filter: /[?+*{}[\]()]/ }, ({ importer, kind, path, resolveDir }) => {
        if (!['dynamic-import', 'import-statement', 'require-call'].includes(kind)) {
          return {
            errors: [
              {
                text: `Cannot resolve paths whose kind is "${kind}"`,
                location: null
              }
            ]
          }
        }

        return {
          namespace: name,
          path,
          pluginData: {
            importer,
            kind,
            resolveDir
          }
        }
      })

      build.onLoad({ filter: /.*/, namespace: name }, async ({
        path,
        pluginData: {
          importer,
          kind,
          resolveDir
        }
      }) => {
        const allFiles = await glob(path, {
          absolute: true,
          cwd: resolveDir,
          ignore: [
            '**/node_modules',
            ...ignore
          ]
        })

        const targetFiles = allFiles
          .filter(path => path !== importer)
          .map(path => relative(resolveDir, path))

        const exports = {}

        const contents = [
          '',
          targetFiles.map(path => {
            const key = createHash('md5').update(path).digest('hex')

            const alias = `_${key}`

            exports[`./${path}`] = alias

            return [
              kind === 'dynamic-import' &&
              `const ${alias} = Promise.resolve(['./${path}', await import('./${path}')])`,

              kind === 'import-statement' &&
              `import * as ${alias} from './${path}';`,

              kind === 'require-call' &&
              `const ${alias} = require('./${path}');`
            ]
          }),
          '',
          (() => {
            const stringified = JSON.stringify(exports, null, 2)

            const fragment = stringified.replace(/"(_[0-9a-f]+)"/g, (_, alias) => alias)

            return [
              kind === 'dynamic-import' &&
              `export default Object.fromEntries(await Promise.all([${Object.values(exports).join(', ')}]))`,

              kind === 'import-statement' &&
              `export default ${fragment};`,

              kind === 'require-call' &&
              `module.exports = ${fragment};`
            ]
          })(),
          ''
        ]
          .flat(Number.MAX_SAFE_INTEGER)
          .filter(line => typeof line === 'string')
          .join('\n')

        debug({ importer, contents })

        return {
          contents,
          resolveDir
        }
      })
    }
  }
}
