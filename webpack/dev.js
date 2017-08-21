const merge = require("webpack-merge");
const path = require("path");

const baseConfig = require("./base.js");

module.exports = function() {
    return merge(baseConfig(), {

        output: {
            filename: "index.js",
            path: path.resolve(__dirname, "..")
        }

    });
}
