var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// ignore-node-modules/foo/bar/baz/qux.js
var qux_exports = {};
__export(qux_exports, {
  default: () => qux_default,
  name: () => name
});
var name = "qux";
var qux_default = name;

// wild-imports:./foo/**/*.js
var __default = {
  "./foo/bar/baz/qux.js": qux_exports
};

// ignore-node-modules/actual.js
var actual_default = __default;
export {
  actual_default as default
};
