
<a href="./coverage.txt">Coverage report</a>

### Known issues

- Aggregations of type `export * from`, although the most common and helpful case, does not work.
  - Cause: under investigation
  - Documentation: <a href="./tests/known-issues/esm-export-aggregation-does-not-work/test.js">./tests/known-issues/esm-export-aggregation-does-not-work/test.js</a>

### Limitations

- require.resolve is not supported
  - Reason: needs further research on how it is supposed to work
  - Documentation: <a href="./tests/limitations/require-resolve-not-supported/test.js">./tests/limitations/require-resolve-not-supported/test.js</a>

### Behaviors

- node_modules are always ignored

- it acts on paths containing one of these characters: `?` `+` `*` `{` `}` `[` `]` `(` `)`

- it uses https://github.com/mrmlnc/fast-glob as the matching engine

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
