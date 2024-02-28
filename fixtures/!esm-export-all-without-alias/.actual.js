var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// wild-imports:./foo/**/*.js
var __exports = {};
__export(__exports, {
  default: () => __default
});

// !esm-export-all-without-alias/foo/bar/baz.js
var baz_exports = {};
__export(baz_exports, {
  default: () => baz_default,
  name: () => name
});
var name = "baz";
var baz_default = name;

// wild-imports:./foo/**/*.js
var __default = {
  "./foo/bar/baz.js": baz_exports
};
export {
  __exports as all
};
