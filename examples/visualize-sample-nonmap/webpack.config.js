// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

console.log(resolve(__dirname));

module.exports = {
  entry: {
    app: resolve(__dirname, './index.js')
  },

  output: {
    path: __dirname,
    filename: 'bundle.js'
  },

  devtool: 'source-map',

  module: {
    rules: [{
      // Compile ES2015 using buble
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve(__dirname), resolve(__dirname, '../../src'), resolve(__dirname, './node_modules/mapbox-gl/js/')],
      options: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: ['transform-runtime', ['transform-flow-strip-types', {
          helpers: false,
          polyfill: false,
          regenerator: true
        }]]
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true
        // eslint options (if necessary)
      }
    }]
  },

  resolve: {
    alias: {
      'harmoware-vis': resolve('./src/index.js'),
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  }
};