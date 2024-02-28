var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name4 in all)
    __defProp(target, name4, { get: all[name4], enumerable: true });
};

// esm-import-export/foo/index.js
var foo_exports = {};
__export(foo_exports, {
  bar: () => bar,
  name: () => name
});
var name = "foo";
var bar = "bar from index";

// esm-import-export/foo/qux.js
var qux_exports = {};
__export(qux_exports, {
  default: () => qux_default,
  name: () => name2
});
var name2 = "qux";
var qux_default = name2;

// esm-import-export/foo/bar/baz.js
var baz_exports = {};
__export(baz_exports, {
  default: () => baz_default,
  name: () => name3
});
var name3 = "baz";
var baz_default = name3;

// wild-imports:./foo/**/*.js
var __default = {
  "./foo/index.js": foo_exports,
  "./foo/qux.js": qux_exports,
  "./foo/bar/baz.js": baz_exports
};

// esm-import-export/actual.js
var actual_default = __default;
export {
  actual_default as default
};
