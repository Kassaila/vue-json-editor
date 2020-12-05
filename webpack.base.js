const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {};

config.module = {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
    },
    {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader'],
    },
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
        },
      ],
    },
  ],
};

config.entry = './src/index.js';

config.output = {
  path: path.resolve(__dirname, './dist'),
  filename: 'vue-json-editor.js',
  library: 'vue-json-editor',
  libraryTarget: 'umd',
};

config.externals = {
  vue: 'Vue',
};

config.plugins = [new VueLoaderPlugin()];

module.exports = config;
