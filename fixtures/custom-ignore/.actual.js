var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name3 in all)
    __defProp(target, name3, { get: all[name3], enumerable: true });
};

// custom-ignore/foo/qux/waldo.js
var waldo_exports = {};
__export(waldo_exports, {
  default: () => waldo_default,
  name: () => name
});
var name = "waldo";
var waldo_default = name;

// custom-ignore/foo/bar/baz.js
var baz_exports = {};
__export(baz_exports, {
  default: () => baz_default,
  name: () => name2
});
var name2 = "baz";
var baz_default = name2;

// wild-imports:./foo/**/*.js
var __default = {
  "./foo/qux/waldo.js": waldo_exports,
  "./foo/bar/baz.js": baz_exports
};

// custom-ignore/actual.js
var actual_default = __default;
export {
  actual_default as default
};
