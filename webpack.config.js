const path = require('path');

const htmlWebPackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['./src/index.ts'],
  module: {
    rules: [
		{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		},
		{
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [
				'style-loader',
				'css-loader',
				'sass-loader'
			]
		},
		{
			test: /\.html$/,
			use:[
				{
					loader: "html-loader",
					options: { minimize: true }
				}
			]
		}
    ],
  }, 
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins:[
	new htmlWebPackPlugin({
		template: "./src/index.html",
		filename: "./index.html"
	}),
	new miniCssExtractPlugin({
		filename: '[name].css',
		chunkFilename: '[id].css'
	})
  ]
}; 