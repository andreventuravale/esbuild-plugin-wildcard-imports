import glob from 'fast-glob'
import { createHash } from 'node:crypto'
import { relative } from 'node:path'

const name = 'wild-imports'

export default function () {
  return {
    name,
    setup (build) {
      build.onResolve({ filter: /[*{}]/ }, ({ importer, kind, path, resolveDir }) => {
        if (!kind.match(/^(import-statement|require-call)$/g)) {
          return {
            errors: [
              {
                text: `can not resolve paths whose kind is "${kind}"`,
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
        let files = await glob(path, {
          absolute: true,
          cwd: resolveDir
        })

        files = files.filter(path => path !== importer).map(path => relative(resolveDir, path))

        const exports = {}

        const contents = [
          '',
          files.map(path => {
            const key = createHash('md5').update(path).digest('hex')

            const alias = `_${key}`

            exports[`./${path}`] = alias

            return [
              kind === 'import-statement' && `import * as ${alias} from './${path}';`,
              kind === 'require-call' && `const ${alias} = require('./${path}');`
            ]
          }),
          '',
          (() => {
            const stringified = JSON.stringify(exports, null, 2)

            const fragment = stringified.replace(/"(_[0-9a-f]+)"/g, (_, alias) => alias)

            return [
              kind === 'import-statement'
                ? `export default ${fragment};`
                : `module.exports = ${fragment};`
            ]
          })(),
          ''
        ].flat(Number.MAX_SAFE_INTEGER).filter(line => typeof line === 'string').join('\n')

        return {
          contents,
          resolveDir
        }
      })
    }
  }
}
