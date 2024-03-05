const isAsyncFunction = (value) => {
  return (
    value && Object.prototype.toString.call(value) === '[object AsyncFunction]'
  )
}

const isObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)

async function resolve(node) {
  if (isAsyncFunction(node)) {
    const resolved = await node()

    return resolve(resolved)
  } else if (isObject(node)) {
    const entries = await Promise.all(
      Object.entries(node).map(async ([key, value]) => [
        key,
        await resolve(value)
      ])
    )

    return Object.fromEntries(entries)
  } else {
    return node
  }
}

module.exports.resolveAll = resolve
