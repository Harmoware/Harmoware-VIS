// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
  entry: {
    app: resolve(__dirname, './index.tsx')
  },

  output: {
    path: __dirname,
    filename: 'bundle.js'
  },

  devtool: 'source-map',

  module: {
    rules: [{
      // Compile ES2015 using buble
      test: /\.ts|\.tsx|\.js|\.jsx$/,
      loader: 'babel-loader',
      include: [resolve(__dirname), resolve(__dirname, '../../src'), resolve(__dirname, './node_modules/mapbox-gl/js/')],
      options: {
        presets: [
          '@babel/env',
          '@babel/react',
          '@babel/typescript'
        ],
        plugins: [
          '@babel/proposal-class-properties',
          '@babel/proposal-object-rest-spread',
          [
            '@babel/plugin-transform-runtime',
            {
              'corejs': false,
              'helpers': true,
              'regenerator': true,
              'useESModules': false
            }
          ]
        ]
      }
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader' // compiles Sass to CSS, using Node Sass by default
      ]
    },
    {
      test: /\.css$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader' // translates CSS into CommonJS
      ]
    }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'harmoware-vis': resolve('./src/index.ts'),
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MAPBOX_ACCESS_TOKEN'])
  ]
};
