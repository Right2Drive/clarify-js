const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const baseConfig = require("./base.js");

module.exports = function() {
    return merge(baseConfig(), {

        output: {
            filename: "index.min.js",
            path: path.resolve(__dirname, "..")
        },

        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false,
                sourceMap: false
            })
        ]
    });
}
