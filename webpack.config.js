// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
  entry: {
    app: resolve('./src/index.js')
  },

  devtool: 'source-map',

  module: {
    rules: [{
      // Compile ES2015 using buble
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve(__dirname, './src'), resolve(__dirname, './node_modules/mapbox-gl/js/')],
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
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MAPBOX_ACCESS_TOKEN', 'MapboxAccessToken'])
  ]
};

// DELETE THIS LINE WHEN COPYING THIS EXAMPLE FOLDER OUTSIDE OF DECK.GL
// It enables bundling against src in this repo rather than installed deck.gl module
module.exports = require('./webpack.config.local')(module.exports);
