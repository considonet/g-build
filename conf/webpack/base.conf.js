const webpack = require('webpack');
const config = require("../../lib/api").getConfig();
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const babelConfig = {
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import"
  ],
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {browsers: config.targetBrowsers }
      }
    ],
    "@babel/preset-react"
  ]
};

const splitChunks = {
  automaticNameDelimiter: ".",
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

if(config.webpack.extractRuntime) {

  entries[config.webpack.extractRuntime] = ["@babel/polyfill"];

  Object.keys(config.jsEntries).forEach(appFile => {
    entries[config.jsEntries[appFile].replace(/\.js$/, "")] = [path.join(process.cwd(), config.paths.input.js, appFile)]
  });

  splitChunks.cacheGroups.vendors.chunks = chunk => config.webpack.extractModules && chunk.name !== config.webpack.extractRuntime;

} else {

  Object.keys(config.jsEntries).forEach(appFile => {
    entries[config.jsEntries[appFile].replace(/\.js$/, "")] = ["@babel/polyfill", path.join(process.cwd(), config.paths.input.js, appFile)]
  });

  if(config.webpack.extractModules) {
    splitChunks.cacheGroups.vendors.chunks = "all";
  }

}

const rules = [
  {
    test: /\.tsx?$/,
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
    test: /\.jsx?$/,
    exclude: file => (
      /node_modules/.test(file) &&
      !/\.vue\.js/.test(file)
    ),
    loader: 'babel-loader',
    options: babelConfig
  }
];

if(config.lint.js) {
  rules.push({
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
      tslint: config.lint.js,
      vue: true
    }));

    plugins.push(new ForkTsCheckerNotifierWebpackPlugin({
      title: 'G-Build TS',
      excludeWarnings: false,
      skipSuccessful: true
    }));

    plugins.push(new WebpackNotifierPlugin({
      title: 'G-Build',
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
    publicPath: typeof config.paths.public !== "undefined" ? config.paths.public.js : "/",
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  entry: entries
});
