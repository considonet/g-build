const webpack = require('webpack');

const baseConfig = require("./base.conf")();

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"'
}));

baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = baseConfig;