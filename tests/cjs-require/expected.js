module.exports = {
  './foo/bar/baz': 'baz',
  './foo/bar/baz.js': 'baz',
  './foo/index': { bar: 'bar from index', name: 'foo' },
  './foo/index.js': { bar: 'bar from index', name: 'foo' },
  './foo/qux': 'qux',
  './foo/qux.js': 'qux',
  foo: {
    bar: {
      baz: 'baz'
    },
    index: {
      bar: 'bar from index',
      name: 'foo'
    },
    qux: 'qux'
  }
}
