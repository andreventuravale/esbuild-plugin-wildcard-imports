
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

### Some examples where the plugin applies

<a href="./tests/cjs-require/test.js#L16">CommonJS</a>

<a href="./tests/esm-import-export/test.js#L16">ESM Import => Export</a>

<a href="./tests/esm-export-aggregation-with-alias/test.js#L16">ESM Export Aggregation ( aliased )</a>

<a href="./tests/esm-dynamic-import/test.js#L16">ESM Dynamic Import</a>
