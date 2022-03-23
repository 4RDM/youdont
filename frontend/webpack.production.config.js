const path = require("path");
const TerserPlugin = require('terser-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	mode: "production",
	entry: path.join(__dirname, "src", "App.tsx"),
	output: {
		path: path.join(__dirname, "dist", "public"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({ parallel: 3 }),
			new TerserPlugin({ parallel: 3 }),
		],
	},
	module: {
		rules: [
			{
				test: /\.(ts)|(tsx)/i,
				use: ["ts-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.(jpg)|(png)|(svg)|(gif)|(webp)$/,
				use: ["file-loader"]
			},
			{
				test: /\.(s[ac]ss)|(css)$/i,
				use: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	}
}