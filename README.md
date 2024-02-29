
<a href="./coverage.txt">Coverage report</a>

---

### Instalation

```bash
pnpm add esbuild-plugin-wildcard-imports --save-dev
```
```bash
yarn add esbuild-plugin-wildcard-imports --dev
```
```bash
npm install esbuild-plugin-wildcard-imports --save-dev
```

### Usage examples

#### Basic

```javascript
import * as esbuild from 'esbuild'
import wildcardImports from 'esbuild-plugin-wildcard-imports'

await esbuild.build({
    plugins: [wildcardImports()],
})
```

#### With custom ignore patterns

```javascript
import * as esbuild from 'esbuild'
import wildcardImports from 'esbuild-plugin-wildcard-imports'

await esbuild.build({
    plugins: [wildcardImports({
      ignore: [
        '**/{build,dist}',
        '**/foo',
        '**/bar'
      ]
    })],
})
```

#### Options

| name | type | optional | notes |
|-|-|-|-|
| ignore | `string[]` | yes | same semantics of fast-glob |

---

### Some examples where the plugin applies

- <a href="./tests/cjs-require/test.js#L16">CommonJS</a>

- <a href="./tests/esm-import-export/test.js#L16">ESM Import => Export</a>

- <a href="./tests/esm-export-aggregation-with-alias/test.js#L16">ESM Export Aggregation ( aliased )</a>

- <a href="./tests/esm-dynamic-import/test.js#L16">ESM Dynamic Import</a>

---

### Known issues

- Aggregations of type `export * from`, although the most common and helpful case, does not work.
  - Cause: under investigation
  - Documentation: <a href="./tests/known-issues/esm-export-aggregation-does-not-work/test.js">./tests/known-issues/esm-export-aggregation-does-not-work/test.js</a>

---

### Behaviors

- The node_modules are always ignored.

- Only the following kind of paths are supported:
  - dynamic-import
  - import-statement
  - require-call

  > See https://esbuild.github.io/plugins/#on-resolve-arguments

- It acts on paths containing one of these characters: `?` `+` `*` `{` `}` `[` `]` `(` `)`.

- It uses fast-glob as the matching engine.

  > See https://github.com/mrmlnc/fast-glob
