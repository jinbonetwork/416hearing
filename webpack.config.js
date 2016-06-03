var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-source-map',
	entry: __dirname + '/_style.js',
	output: {
		path: __dirname,
		filename: '_style_b.js'
	},
	module: {
		loaders: [
			{ test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less' }
			//{ test: /\.less$/, loader: 'style!css!postcss-loader!less' }
		]
	},
	postcss: function(){
		return [require('autoprefixer')];
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/_index.html.php',
			filename: __dirname + '/index.html.php'
		})
	]
}
