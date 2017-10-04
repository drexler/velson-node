var copyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/index.ts',
  output: {
    libraryTarget: 'commonjs',
    filename: './dist/velson.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{
      test: /\.ts?$/,
      loader: 'ts-loader'
    }]
  },
  plugins: [
    new copyWebpackPlugin([{
      from: 'lib',
      to: 'dist/lib'
    }])
  ],
  externals: nodeModules
}
