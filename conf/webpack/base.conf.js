const webpack = require('webpack');
const config = require("../../lib/api").getConfig();
const path = require('path');

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

Object.keys(config.jsEntries).forEach(appFile => {
  entries[config.jsEntries[appFile]] = [path.join(process.cwd(), config.paths.input.js, appFile)]
});

if(config.webpack.extractModules) {
  splitChunks.cacheGroups.vendors.chunks = "all";
}

const rules = [
  {
    test: /\.json5$/,
    loader: 'json5-loader'
  },
  {
    test: /\.[jt]sx?$/,
    exclude: file => (
      /node_modules/.test(file)
    ),
    use: config.lint.js ? ["babel-loader", "eslint-loader"] : ["babel-loader"]
  }
];

rules.push({
  test: /\.vue$/,
  loader: "vue-loader",
  options: {
    prettify: false
  }
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
