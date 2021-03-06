"use strict";

var archetype = require("../archtype");
var mergeWebpackConfig = archetype.devRequire("webpack-partial").default;
var path = require("path");

var baseConfig = require("./base.js");

var testConfig = {
  module: {
    /*
     * This prevents webpack from running its parsers on any sinon files. Sinon breaks when it is
     * `import`ed by a file or module such as enzyme or your spec files.
     * See here:
     * https://github.com/webpack/webpack/issues/304
     * https://github.com/sinonjs/sinon/pull/600#issuecomment-162529457
     */
    noParse: [
      /node_modules\/sinon\//
    ]
  },
  context: path.join(process.cwd(), "test/client"),
  debug: false,
  devServer: {
    stats: "errors-only"  // only show errors
  },
  entry: path.join(__dirname, "../karma/entry"),
  output: {
    path: process.cwd(),
    filename: "bundle.js",
    publicPath: "/assets/"
  },
  resolve: {
    alias: {
      // Allow root import of `src/FOO` from ROOT/src.
      src: process.cwd(),
      sinon: archetype.devRequire.resolve("sinon/pkg/sinon")
    }
  },
  // Enzyme depends jsdom and cheerio being global to render their DOM.
  externals: {
    jsdom: "window",
    cheerio: "window",
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true
  }
};

module.exports = mergeWebpackConfig(baseConfig, testConfig);
