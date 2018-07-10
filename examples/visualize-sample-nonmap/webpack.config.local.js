// This file contains webpack configuration settings that allow
// examples to be built against the deck.gl source code in this repo instead
// of building against their installed version of deck.gl.
//
// This enables using the examples to debug the main deck.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

// Support for hot reloading changes to the deck.gl library:
const LOCAL_DEV_CONFIG = {
  // suppress warnings about bundle size
  devServer: {
    stats: {
      warnings: false
    }
  },

  resolve: {
    alias: {
      // Imports the deck.gl library from the src directory in this repo
      'deck.gl': SRC_DIR,
      // Important: ensure shared dependencies come from the main node_modules dir
      'luma.gl': resolve(LIB_DIR, './node_modules/luma.gl'),
      react: resolve(LIB_DIR, './node_modules/react')
    }
  },
  module: {
    rules: [
      {
        // Inline shaders
        test: /\.glsl$/,
        loader: 'raw-loader',
        exclude: [/node_modules/]
      }
    ]
  }
};

function addLocalDevSettings(config) {
  const retConfig = config;
  retConfig.resolve = retConfig.resolve || {};
  retConfig.resolve.alias = retConfig.resolve.alias || {};
  Object.assign(retConfig.resolve.alias, LOCAL_DEV_CONFIG.resolve.alias);

  retConfig.module = retConfig.module || {};
  Object.assign(retConfig.module, {
    rules: (retConfig.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules)
  });
  return retConfig;
}

module.exports = baseConfig => (env) => {
  const config = baseConfig;
  if (env && env.local) {
    addLocalDevSettings(config);
  }

  return config;
};
