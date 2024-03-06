<a href="./coverage.txt">Coverage report</a>

---

### Limitations & Known issues

- Only works with `platform=node` and `bundle=true`

- The majority of the automated tests covers `format=cjs`

- Dynamic imports with top-level await won't work with `format=cjs`

### FAQ

- Does it work with `format=esm`?

  - The esm output format was tested to the extent necessary to attain 100% code coverage; however, it was not thoroughly examined for all conceivable scenarios and opportunities.

- Does `format=cjs` mean the plugin only works with a CommonJS codebase?

  - Not at all, you can use the plugin with your ES codebase. The `format=cjs` is about the esbuild output format. The library has been tested and works with ES modules.

- Does it work with non-Node.js platforms?

  - I haven't had the time to write tests to cover non-Node.js platforms, so I intentionally limited the usage to on the Node.js for now.

- Are there any plans to migrate it to Go?

  - Yes but I need to learn Go first.

### Behaviors

- The `node_modules` folders are always ignored.

- Only the following kind of paths are supported:

  - dynamic-import
  - import-statement
  - require-call

  > See https://esbuild.github.io/plugins/#on-resolve-arguments

- It acts on paths containing one of these characters: `?` `+` `*` `{` `}` `[` `]` `(` `)`.

- It uses fast-glob as the matching engine.

  > See https://github.com/mrmlnc/fast-glob

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

---

### Usage examples

#### Basic use

```javascript
import * as esbuild from 'esbuild'
import wildcardImports from 'esbuild-plugin-wildcard-imports'

await esbuild.build({
  plugins: [wildcardImports()]
})
```

#### With custom ignore patterns

```javascript
import * as esbuild from 'esbuild'
import wildcardImports from 'esbuild-plugin-wildcard-imports'

await esbuild.build({
  plugins: [
    wildcardImports({
      ignore: ['**/{build,dist}', '**/foo', '**/bar']
    })
  ]
})
```

#### Options

| name   | type       | optional | notes                       |
| ------ | ---------- | -------- | --------------------------- |
| ignore | `string[]` | yes      | same semantics of fast-glob |

---

### Some examples where the plugin applies

- <a href="./tests/cjs/require/test.js#L14">CommonJS</a>

- <a href="./tests/cjs/export-aggregation/test.js#L16">ESM export aggregation</a>

- <a href="./tests/cjs/import-re-export/test.js#L14">ESM import and re-export</a>

- <a href="./tests/esm/dynamic-import/fixtures/input.js">ESM Dynamic Import</a>
