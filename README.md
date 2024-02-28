
### Usage

```javascript
    await esbuild.build({
        plugins: [wildImports(options)],
    })
```

#### Options

- ignore: string[]
   - optional: yes 
   - same semantics of fast-glob

### Import examples

<a href="./tests/cjs-require/actual.js">CommonJS</a>

<a href="./tests/esm-import-export/actual.js">ESM Import => Export</a>

<a href="./tests/esm/actual.js">ESM Export Only</a>

<a href="./tests/esm-dynamic-import/actual.js">ESM Dynamic Import</a>

### Behaviors

- node_modules are always ignored

### Limitations

- Nested files containing wildcard imports won't work as expected.
  - Status: under investigation