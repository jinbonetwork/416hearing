var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-source-map',
	entry: __dirname + '/bundle.dev.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less' },
			{ test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader!less' }
		]
	},
	postcss: function(){
		return [require('autoprefixer')];
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/index.dev.html.php',
			filename: __dirname + '/index.html.php'
		})
	]
}
