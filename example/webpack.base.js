const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {};

config.entry = './src/main.js';
config.output = {
  path: path.resolve(__dirname, './dist/'),
  publicPath: '',
  filename: '[name]_[hash].js',
};

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

config.plugins = [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new CleanWebpackPlugin(),
];

config.externals = {
  vue: 'Vue',
};

module.exports = config;
