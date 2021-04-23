/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const packageJSON = fs.readFileSync('./package.json');
const version = JSON.parse(packageJSON).version || 0;

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
    ],
    resolve: {
      alias: {},
    },
  },
};
