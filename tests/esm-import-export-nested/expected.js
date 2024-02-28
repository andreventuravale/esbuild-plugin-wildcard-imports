export const message = `
    The "./foo/bar/index.js" path should be an empty object.
    Since the "0.0.1" version, nested glob imports are not supposed to work.
`

export default {
  './foo/bar/index.js': {},
  './foo/bar/baz/qux.js': {
    default: 'qux',
    name: 'qux'
  }
}
