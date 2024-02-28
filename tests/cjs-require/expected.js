module.exports = {
  foo: {
    index: { bar: 'bar from index', name: 'foo' },
    qux: 'qux',
    bar: { baz: 'baz' }
  },
  './foo/index.js': { bar: 'bar from index', name: 'foo' },
  'foo/index': { bar: 'bar from index', name: 'foo' },
  './foo/qux.js': 'qux',
  'foo/qux': 'qux',
  './foo/bar/baz.js': 'baz',
  'foo/bar/baz': 'baz'
}
