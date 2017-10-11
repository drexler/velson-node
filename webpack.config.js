var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var shell = require('shelljs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  context: path.resolve(__dirname),
  node: {
    __dirname: false
  },
  entry: {
    index: './src/engine.ts',
    velson: './src/index.ts'
  },
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: __dirname + '/dist'
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
    function() {
      this.plugin('done', () => {
        shell
          .echo('#!/usr/bin/env node\n')
          .cat(`${__dirname}/dist/velson.js`)
          .to(`${__dirname}/dist/velson.js`)
        shell.chmod(755, `${__dirname}/dist/velson.js`)
      })
    }
  ],
  externals: nodeModules
}
