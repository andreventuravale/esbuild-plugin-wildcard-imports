var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// cjs-require/foo/index.js
var require_foo = __commonJS({
  "cjs-require/foo/index.js"(exports2, module2) {
    var name = "foo";
    var bar = "bar from index";
    module2.exports = {
      bar,
      name
    };
  }
});

// cjs-require/foo/qux.js
var require_qux = __commonJS({
  "cjs-require/foo/qux.js"(exports2, module2) {
    module2.exports = "qux";
  }
});

// cjs-require/foo/bar/baz.js
var require_baz = __commonJS({
  "cjs-require/foo/bar/baz.js"(exports2, module2) {
    module2.exports = "baz";
  }
});

// wild-imports:./foo/**/*.js
var require__ = __commonJS({
  "wild-imports:./foo/**/*.js"(exports2, module2) {
    var _b15b80ba9ecd4a485e412da2c964e499 = require_foo();
    var _5080733ccefece4245f0aabca1b2b8d3 = require_qux();
    var _89a4175e31f412945e6049395048637a = require_baz();
    module2.exports = {
      "./foo/index.js": _b15b80ba9ecd4a485e412da2c964e499,
      "./foo/qux.js": _5080733ccefece4245f0aabca1b2b8d3,
      "./foo/bar/baz.js": _89a4175e31f412945e6049395048637a
    };
  }
});

// cjs-require/actual.js
var all = require__();
module.exports = all;
