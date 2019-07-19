const webpack = require('webpack');
const config = require("../../lib/api").getConfig();
const path = require('path');
const fs = require('fs');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const splitChunks = {
  automaticNameDelimiter: ".",
  minSize: 0,
  cacheGroups: {
    "async/async": {
      chunks: "async",
      test: /[\\/]node_modules[\\/]/,
      priority: -5
    },
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
};

const entries = {};

// Resolving babel config to determine usagePolyfills setting
let babelConfig = null;

const babelPaths = [
  path.join(process.cwd(), "babel.config.js"),
  path.join(process.cwd(), ".babelrc.js"),
  path.join(process.cwd(), ".babelrc"),
];

babelPaths.some(p => {
  if(fs.existsSync(p)) {
    babelConfig = require(p);
    return true;
  }
});

if(babelConfig === null) {
  const packageJson = require(path.join(process.cwd(), "package.json"));
  if(typeof packageJson.babel !== "undefined") {
    babelConfig = packageJson.babel;
  }
}

let usagePolyfills = false;

if(babelConfig !== null && typeof babelConfig.presets !== "undefined") {

  babelConfig.presets.some(preset => {
    if(
      typeof preset === "object" &&
      preset[0] === "@babel/preset-env" &&
      typeof preset[1] === "object" &&
      typeof preset[1].useBuiltIns !== "undefined" &&
      preset[1].useBuiltIns === "usage")
    {
      usagePolyfills = true;
      return true;
    }
  })

}

if(config.webpack.extractRuntime) {

  if(usagePolyfills) {
    entries[config.webpack.extractRuntime] = [];
  } else {
    entries[config.webpack.extractRuntime] = ["core-js/stable", "regenerator-runtime/runtime"];
  }

  Object.keys(config.jsEntries).forEach(appFile => {
    entries[config.jsEntries[appFile]] = [path.join(process.cwd(), config.paths.input.js, appFile)]
  });

  splitChunks.cacheGroups.vendors.chunks = chunk => config.webpack.extractModules && chunk.name !== config.webpack.extractRuntime;

} else {

  if(usagePolyfills) {

    Object.keys(config.jsEntries).forEach(appFile => {
      entries[config.jsEntries[appFile]] = [path.join(process.cwd(), config.paths.input.js, appFile)]
    });

  } else {

    Object.keys(config.jsEntries).forEach(appFile => {
      entries[config.jsEntries[appFile]] = ["core-js/stable", "regenerator-runtime/runtime", path.join(process.cwd(), config.paths.input.js, appFile)]
    });

  }

  if(config.webpack.extractModules) {
    splitChunks.cacheGroups.vendors.chunks = "all";
  }

}

const rules = [
  {
    test: /\.json5$/,
    loader: 'json5-loader'
  },
  {
    test: /\.[jt]sx?$/,
    exclude: file => (
      /node_modules/.test(file) &&
      !/\.vue\.js/.test(file)
    ),
    loader: 'babel-loader'
  }
];

if(config.lint.js) {
  rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    oneOf: [
      {
        resourceQuery: /^\?vue/,
        loader: 'eslint-loader',
        options: {}
      },
      {
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {}
      }
    ]
  });
}

rules.push({
  test: /\.vue$/,
  loader: 'vue-loader'
});

module.exports = () => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue']
  },
  module: {
    rules
  },
  optimization: {
    splitChunks
  },
  plugins: (() => {

    const plugins = [];
    plugins.push(new VueLoaderPlugin());

    plugins.push(new ForkTsCheckerWebpackPlugin({
      async: true,
      silent: false,
      eslint: config.lint.js,
      vue: true
    }));

    // Optional notifications
    if(config.bubbleNotifications.js) {

      plugins.push(new ForkTsCheckerNotifierWebpackPlugin({
        title: 'G-Build (TS)',
        excludeWarnings: false,
        skipSuccessful: true
      }));

      plugins.push(new WebpackNotifierPlugin({
        title: 'G-Build (JS)',
        excludeWarnings: false,
        skipSuccessful: true,
        icon: path.join(__dirname, '../../images/icon.png')
      }));

    }

    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());

    return plugins;

  })(),
  output: {
    path: path.join(process.cwd(), config.paths.output.js),
    publicPath: typeof config.paths.public !== "undefined" ? config.paths.public.js : "/",
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  entry: entries
});
