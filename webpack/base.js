const path = require("path");

module.exports = function() {
    return {

        entry: path.resolve(__dirname, "..", "src", "index.ts"),

        target: "web",

        resolve: {
            extensions: [ ".webpack.js", ".web.js", ".ts", ".js" ]
        },

        module: {
            rules: [
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.tsx?$/,
                    loaders: [
                        "babel-loader?presets[]=es2015",
                        "awesome-typescript-loader"
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
            ]
        }
    };
}
