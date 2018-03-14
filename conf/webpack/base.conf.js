const webpack = require('webpack');
const config = require("../../lib/api").getConfig();
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const entries = {};
Object.keys(config.jsEntries).forEach(appFile => {
  entries[config.jsEntries[appFile]] = ["babel-polyfill", path.join(process.cwd(), config.paths.input.js, appFile)]
});

const babelConfig = {
  "plugins": [
    "transform-object-rest-spread"
  ],
  "presets": [
    [
      "env",
      {
        "modules": false,
        "targets": {browsers: config.targetBrowsers }
      }
    ]
  ]
};

module.exports = () => ({
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: babelConfig
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: {
              loader: 'babel-loader',
              options: babelConfig
            }
          }
        }
      }
    ]
  },
  plugins: (() => {

    const plugins = [];
    plugins.push(new ForkTsCheckerWebpackPlugin);

    if(config.hardSourceCache) {

      plugins.push(new HardSourceWebpackPlugin({
        cacheDirectory: path.join(process.cwd(), 'node_modules/.cache/hard-source/[confighash]'),
        recordsPath: path.join(process.cwd(), 'node_modules/.cache/hard-source/[confighash]/records.json'),
        configHash(webpackConfig) {
          return require('node-object-hash')({sort: false}).hash(webpackConfig);
        },
        environmentHash: {
          root: process.cwd(),
          directories: ['node_modules'],
          files: ['package.json']
        }
      }));

    }

    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());

    return plugins;

  })(),
  output: {
    path: path.join(process.cwd(), config.paths.output.js),
    filename: '[name]'
  },
  entry: entries
});
