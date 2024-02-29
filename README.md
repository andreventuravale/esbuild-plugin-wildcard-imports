
### Known issues

- Aggregations of type `export * from`, although the most common and helpful case, does not work.
  - Reason: under investigation
  - Documented at: <a href="./tests/known-issues/esm-export-aggregation-does-not-work/test.js">./tests/known-issues/esm-export-aggregation-does-not-work/test.js</a>


### Behaviors

- node_modules are always ignored

### Usage

```javascript
    await esbuild.build({
        plugins: [wildcardImports(options)],
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
