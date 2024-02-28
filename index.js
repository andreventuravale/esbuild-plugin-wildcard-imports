import glob from 'fast-glob'
import { isString, setWith } from 'lodash-es'
import { createHash } from 'node:crypto'
import { basename, dirname, extname, join, relative } from 'node:path'

const name = 'wild-imports'

export default function ({ tree = true } = {}) {
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

      build.onLoad({ filter: /.*/, namespace: name }, ({
        path,
        pluginData: {
          importer,
          kind,
          resolveDir
        }
      }) => {
        let files = glob.sync(path, {
          absolute: true,
          cwd: resolveDir
        })

        console.log({ importer, files })

        files = files.filter(p => p !== importer).map(p => relative(resolveDir, p))

        console.log({ importer, files })

        const exports = {}

        const contents = [
          '',
          files.map(path => {
            const key = createHash('md5').update(path).digest('hex')

            const alias = `_${key}`

            const pathWithNoName = join(dirname(path), basename(path, extname(path)))

            const objectPath = pathWithNoName
              .replace(/\//g, '.')

            if (tree) {
              setWith(exports, objectPath, alias, Object)
            }

            exports[`./${path}`] = alias

            exports[`./${pathWithNoName}`] = alias

            return [
              kind === 'import-statement' && `import * as ${alias} from './${path}';`,
              kind === 'require-call' && `const ${alias} = require('./${path}');`
            ].filter(isString)
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
        ].flat().join('\n')

        console.log(importer, contents)

        return {
          contents,
          resolveDir
        }
      })
    }
  }
}
