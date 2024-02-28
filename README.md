
### Usage

```javascript
    await esbuild.build({
        plugins: [wildImports(options)],
    })
```

#### Options

- ignore: string[]
   - same semantics of fast-glob

### Import examples

<a href="./tests/cjs-require/actual">CommonJs</a>

<a href="./tests/esm-import-export/actual">ESM</a>

<a href="./tests/esm-dynamic-import/actual">ESM Dynamic Import</a>

### Behaviors

- node_modules are always ignored

### Limitations

- Nested files containing wildcard imports won't work as expected.
  - Status: under investigation
