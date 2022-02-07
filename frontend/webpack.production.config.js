// https://github.com/JaZax/webpackReactTemplate

const TerserPlugin = require('terser-webpack-plugin')
const { join, resolve } = require('path')

module.exports = {
	mode: 'production',
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
