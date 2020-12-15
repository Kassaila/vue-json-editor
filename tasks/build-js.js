/**
 * Build js
 */
'use strict';

const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

module.exports = function () {
  const production = global.isProduction();

  return (done) => {
    try {
      const config = {
        mode: 'none',
        entry: global.buildJs.getEntryPoints(),
        output: {
          path: path.resolve(`./`, `${global.folder.build}/`),
          filename: '[name].js',
          library: 'vue-json-editor',
          libraryTarget: 'umd',
        },
        optimization: {
          minimize: production,
        },
        plugins: [new VueLoaderPlugin()],
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
            {
              test: /\.m?js$/,
              loader: 'babel-loader',
              exclude: /(node_modules)/,
            },
          ],
        },
        externals: global.buildJs.externalLibs,
      };

      webpack(config, (error, stats) => {
        if (error) {
          throw new Error(error);
        }

        if (production) {
          console.log(
            stats.toString({
              version: false,
              hash: false,
              chunks: false,
              colors: true,
            })
          );
        }

        return done();
      });
    } catch (error) {
      notifier.error(error, 'JS compiling error', done);
    }
  };
};
