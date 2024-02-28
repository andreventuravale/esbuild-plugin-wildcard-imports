var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// !esm-import-export-nested/foo/bar/index.js
var bar_exports = {};

// !esm-import-export-nested/foo/bar/baz/qux.js
var qux_exports = {};
__export(qux_exports, {
  default: () => qux_default,
  name: () => name
});
var name = "qux";
var qux_default = name;

// wild-imports:./foo/**/*.js
var __default = {
  "./foo/bar/index.js": bar_exports,
  "./foo/bar/baz/qux.js": qux_exports
};

// !esm-import-export-nested/actual.js
var actual_default = __default;
export {
  actual_default as default
};
