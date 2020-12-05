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
    {
      test: /\.(png|jpg|gif|webp)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    },
    {
      test: /\.svg/,
      loader: 'url-loader',
    },
    {
      test: /\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    },
  ],
};

config.plugins = [new VueLoaderPlugin()];

module.exports = config;
