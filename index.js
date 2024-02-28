import glob from 'fast-glob'
import { isString, setWith } from 'lodash-es'
import { createHash } from 'node:crypto'
import { basename, dirname, extname, join } from 'node:path'

const name = 'wild-imports'

export default function () {
  return {
    name,
    setup (build) {
      build.onResolve({ filter: /[*{}]/ }, ({ importer, kind, path, resolveDir }) => {
        if (!kind.match(/^(entry-point|import-statement|require-call)$/g)) {
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
            kind,
            resolveDir
          }
        }
      })

      build.onLoad({ filter: /.*/, namespace: name }, ({
        path,
        pluginData: {
          kind,
          resolveDir
        }
      }) => {
        const files = glob.sync(path, {
          cwd: resolveDir
        })

        const exports = {}

        const contents = [
          '',
          files.map(path => {
            const key = createHash('md5').update(path).digest('hex')

            const alias = `_${key}`

            const pathWithNoName = join(dirname(path), basename(path, extname(path)))

            const objectPath = pathWithNoName
              .replace(/\//g, '.')

            setWith(exports, objectPath, alias, Object)

            exports[path] = alias

            exports[pathWithNoName] = alias

            return [
              kind === 'import-statement' && `import * as ${alias} from '${path}';`,
              kind === 'require-call' && `const ${alias} = require('${path})';`
            ].filter(isString)
          }),
          '',
          (() => {
            const stringified = JSON.stringify(exports, null, 2)

            const fragment = stringified.replace(/"(_[0-9a-f]+)"/g, (_, alias) => alias)

            return [
              kind === 'import-statement'
                ? `export default ${fragment}`
                : `module.exports = ${fragment}`
            ]
          })(),
          ''
        ].flat().join('\n')

        console.log(contents)

        return {
          contents,
          resolveDir
        }
      })
    }
  }
}
