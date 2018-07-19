const webpack = require('webpack');
const config = require("../../lib/api").getConfig();
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.json5$/,
        loader: 'json5-loader'
      },
      {
        test: /\.js$/,
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        loader: 'babel-loader',
        options: babelConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        oneOf: [
            {
                resourceQuery: /^\?vue/,
                loader: 'tslint-loader',
                options: {}
            },
            {
                loader: 'tslint-loader',
                enforce: 'pre',
                options: {}
            }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: (() => {

    const plugins = [];
    plugins.push(new VueLoaderPlugin());
    plugins.push(new ForkTsCheckerWebpackPlugin({
      async: true,
      silent: false,
      tslint: true,
      vue: true
    }));

    plugins.push(new ForkTsCheckerNotifierWebpackPlugin({
      title: 'gbuild TS',
      excludeWarnings: false,
      skipSuccessful: true
    }));

    plugins.push(new WebpackNotifierPlugin({
      title: 'gbuild',
      excludeWarnings: false,
      skipSuccessful: true,
      icon: path.join(__dirname, '../../images/icon.png')
    }));

    if(config.webpack.hardSourceCache) {

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
