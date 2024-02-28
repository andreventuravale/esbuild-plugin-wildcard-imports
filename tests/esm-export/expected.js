export default {
  foo: {
    index: { bar: 'bar from index', name: 'foo' },
    qux: { default: 'qux', name: 'qux' },
    bar: { baz: { default: 'baz', name: 'baz' } }
  },
  './foo/index.js': { bar: 'bar from index', name: 'foo' },
  'foo/index': { bar: 'bar from index', name: 'foo' },
  './foo/qux.js': { default: 'qux', name: 'qux' },
  'foo/qux': { default: 'qux', name: 'qux' },
  './foo/bar/baz.js': { default: 'baz', name: 'baz' },
  'foo/bar/baz': { default: 'baz', name: 'baz' }
}
