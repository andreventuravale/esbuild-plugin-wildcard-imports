const { isAsyncFunction } = require('node:util/types')

const isObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)

async function resolve (node) {
  if (isAsyncFunction(node)) {
    return resolve(await node())
  } else if (isObject(node)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(node).map(async ([key, value]) => [
          key,
          await resolve(value)
        ])
      )
    )
  } else {
    return node
  }
}

module.exports.eagerLoad = resolve
