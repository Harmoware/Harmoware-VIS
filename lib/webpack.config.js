// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file
// avoid destructuring for older Node version support
var resolve = require('path').resolve;
var webpack = require('webpack');
module.exports = {
    devtool: 'source-map',
    module: {
        rules: [{
                // Compile ES2015 using buble
                test: /\.(js|ts|tsx)$/,
                loader: 'babel-loader',
                include: [resolve(__dirname, './src'), resolve(__dirname, './node_modules/mapbox-gl/js/')]
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
        new webpack.EnvironmentPlugin(['MAPBOX_ACCESS_TOKEN'])
    ]
};
//# sourceMappingURL=webpack.config.js.map