// https://github.com/JaZax/webpackReactTemplate

const { optimize, DefinePlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { join, resolve } = require('path')
const { readdirSync, unlinkSync } = require('fs')

var nodeEnv = process.env.NODE_ENV || 'development'

const minify = (input, sourceMap, minimizerOptions, extractsComments) => {
	const { map, code } = require('uglify-js').minify(input, {})

	return { map, code, warnings: [], errors: [], extractedComments: [] }
}

minify.getMinimizerVersion = () => {
	let packageJson

	try {
		packageJson = require('uglify-module/package.json')
	} catch (error) {}

	return packageJson && packageJson.version
}

module.exports = {
	mode: 'development',
	devServer: {
		hot: true,
		contentBase: './dist',
		historyApiFallback: true,
	},
	entry: resolve(__dirname, './src/app.tsx'),
	output: {
		filename: 'bundle.js',
		path: join(__dirname, 'dist', 'public'),
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(js|ts)x?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /\.(png|svg|jpg|gif|webp)$/,
				use: ['file-loader'],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: 4,
			}),
		],
	},
}
