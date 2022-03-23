const path = require("path");

module.exports = {
	mode: "development",
	entry: path.join(__dirname, "src", "App.tsx"),
	output: {
		path: path.join(__dirname, "dist", "public"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		port: 9000,
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