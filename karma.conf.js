// Karma configuration
// Generated on Thu May 25 2017 09:17:34 GMT-0600 (Mountain Daylight Time)

const path = require("path");
const webpack = require("webpack");

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine"],

		// list of files / patterns to load in the browser
		files: [
			"test/index.spec.ts"
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"test/index.spec.ts": ["webpack", "sourcemap"]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress"],

		// web server port
		port: 5000,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,
		
		mime: {
			'text/x-typescript': ['ts']
		},

		// Set Webpack configuration, but set the entry to spec files
		webpack: {
			devtool: "inline-source-map",

			target: "web",

			entry: {
				"main-test": path.resolve(__dirname, "test", "index.spec.ts")
			},

			resolve: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
				modules: [
					__dirname,
					path.resolve(__dirname, "node_modules")
				]
			},

			output: {
				path: path.resolve(__dirname, "Test", "dist"),
				filename: "[name].js"
			},

			module: {
				rules: [
					{
						test: /\.ts$/,
						loaders: [
							"babel-loader?presets[]=es2015",
							"awesome-typescript-loader"
						],
						exclude: [/\.(spec|e2e|d)\.ts$/]
					}
				]
			},

			node: {
				fs: "empty"
			},

			plugins: [
				new webpack.SourceMapDevToolPlugin({
					filename: null, // if no value is provided the sourcemap is inlined
					test: /\.(ts|js)($|\?)/i // process .js and .ts files only
				})
			],

			externals: {
				"cheerio": "window"
			}
		}
	})
}
