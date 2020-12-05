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
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
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
config.devtool = 'none';
config.externals = {
  vue: 'Vue',
};

config.plugins = [new VueLoaderPlugin()];

module.exports = config;
