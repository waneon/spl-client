const path = require('path');
const Html = require('html-webpack-plugin');

const config = {
  entry: path.join(__dirname, 'src', 'index.jsx'),
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new Html({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  devServer: {
    port: 8000,
  },
};

exports.default = config;
