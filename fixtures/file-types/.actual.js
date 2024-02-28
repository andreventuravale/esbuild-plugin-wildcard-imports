var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all2) => {
  for (var name4 in all2)
    __defProp(target, name4, { get: all2[name4], enumerable: true });
};

// file-types/foo/qux.mts
var qux_exports = {};
__export(qux_exports, {
  default: () => qux_default,
  name: () => name
});
var name, qux_default;
var init_qux = __esm({
  "file-types/foo/qux.mts"() {
    name = "qux";
    qux_default = name;
  }
});

// file-types/foo/waldo.ts
var waldo_exports = {};
__export(waldo_exports, {
  default: () => waldo_default,
  name: () => name2
});
var name2, waldo_default;
var init_waldo = __esm({
  "file-types/foo/waldo.ts"() {
    name2 = "waldo";
    waldo_default = name2;
  }
});

// file-types/foo/bar/baz.mjs
var baz_exports = {};
__export(baz_exports, {
  default: () => baz_default,
  name: () => name3
});
var name3, baz_default;
var init_baz = __esm({
  "file-types/foo/bar/baz.mjs"() {
    name3 = "baz";
    baz_default = name3;
  }
});

// wild-imports:./foo/**/*.{mjs,mts,js,ts}
var __exports = {};
__export(__exports, {
  default: () => __default
});
var _acd8c9ca5e94fd61f8e58d13ad390c2d, _2780dcc49c27166faedf56768ac50516, _bd41af1f5e5edf1897d702ea82484ed5, __default;
var init__ = __esm({
  async "wild-imports:./foo/**/*.{mjs,mts,js,ts}"() {
    _acd8c9ca5e94fd61f8e58d13ad390c2d = Promise.resolve(["./foo/qux.mts", await Promise.resolve().then(() => (init_qux(), qux_exports))]);
    _2780dcc49c27166faedf56768ac50516 = Promise.resolve(["./foo/waldo.ts", await Promise.resolve().then(() => (init_waldo(), waldo_exports))]);
    _bd41af1f5e5edf1897d702ea82484ed5 = Promise.resolve(["./foo/bar/baz.mjs", await Promise.resolve().then(() => (init_baz(), baz_exports))]);
    __default = Object.fromEntries(await Promise.all([_acd8c9ca5e94fd61f8e58d13ad390c2d, _2780dcc49c27166faedf56768ac50516, _bd41af1f5e5edf1897d702ea82484ed5]));
  }
});

// file-types/actual.js
var all = await init__().then(() => __exports);
var actual_default = all;
export {
  actual_default as default
};
