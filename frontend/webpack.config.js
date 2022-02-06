// https://github.com/JaZax/webpackReactTemplate

const { optimize, DefinePlugin } = require('webpack')
const { join, resolve } = require('path')

var nodeEnv = process.env.NODE_ENV || 'development'

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
	plugins: [
		new DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
			__REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
		}),
	],
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'async',
			minSize: 20000,
			minChunks: 1,
			maxAsyncRequests: 30,
			maxInitialRequests: 30,
			enforceSizeThreshold: 50000,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},
}
