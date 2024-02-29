
<a href="./coverage.txt">Coverage report</a>

### Known issues

- Aggregations of type `export * from`, although the most common and helpful case, does not work.
  - Cause: under investigation
  - Documentation: <a href="./tests/known-issues/esm-export-aggregation-does-not-work/test.js">./tests/known-issues/esm-export-aggregation-does-not-work/test.js</a>

---

### Behaviors

- node_modules are always ignored

- Only the following kind of paths are supported:
  - dynamic-import
  - import-statement
  - require-call

  > See https://esbuild.github.io/plugins/#on-resolve-arguments

- it acts on paths containing one of these characters: `?` `+` `*` `{` `}` `[` `]` `(` `)`

- it uses fast-glob as the matching engine

  > See https://github.com/mrmlnc/fast-glob

### Usage

```javascript
    await esbuild.build({
        plugins: [wildcardImports(options)],
    })
```

#### Options

| name | type | optional | notes |
|-|-|-|-|
| ignore | string[] | yes | same semantics of fast-glob |

### Some examples where the plugin applies

- <a href="./tests/cjs-require/test.js#L16">CommonJS</a>

- <a href="./tests/esm-import-export/test.js#L16">ESM Import => Export</a>

- <a href="./tests/esm-export-aggregation-with-alias/test.js#L16">ESM Export Aggregation ( aliased )</a>

- <a href="./tests/esm-dynamic-import/test.js#L16">ESM Dynamic Import</a>
