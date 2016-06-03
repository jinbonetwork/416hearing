var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: __dirname + '/_style.js',
	output: {
		path: __dirname,
		filename: '_style_b.js'
	},
	module: {
		loaders: [
			{ test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less') }
		]
	},
	postcss: function(){
		return [require('autoprefixer')];
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/_index.html.php',
			filename: __dirname + '/index.html.php'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin('style.css')
	]
}
