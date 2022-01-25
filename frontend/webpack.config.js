// https://github.com/JaZax/webpackReactTemplate

const path = require('path')

module.exports = {
	mode: 'development',
	devServer: {
		hot: true,
		contentBase: './dist',
		historyApiFallback: true,
	},
	entry: path.resolve(__dirname, './src/app.tsx'),
	output: {
		filename: 'bundle.js',
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
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader'],
			},
		],
	},
}
