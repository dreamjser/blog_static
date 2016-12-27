const webpack = require('webpack');
const path = require('path');
const staticCND = 'http://static.dreamjser.com/';

var config = {
	entry: './src/js/entry/',
	bundle: './src/js/bundle/',
	ensure: './src/js/ensure/'
}

var webpackConfig = {
	entry: {
		home: config.entry + 'home.js',
		files: config.entry + 'files.js',
		article: config.entry + 'article.js',
		tag: config.entry + 'tag.js',
		category: config.entry + 'category.js',
		about: config.entry + 'about.js',
		common: [
			'react',
			'react-dom'
		]
	},
	output: {
		publicPath: staticCND,
		filename: config.bundle + '[name].js',
		chunkFilename: config.ensure + '[name].js'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ['common']
		}),
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
	],
	module: {
    noParse: [
      /^react$/,
      /^react-dom$/
    ],
		rules: [{
			test: /\.scss$/,
      exclude: /node_modules/,
			use: ['style', 'css', 'sass']
		}, {
			test: /\.(js|jsx)$/,
      exclude: /node_modules/,
			use: ['eslint', 'babel']
		}, {
			test: /\.(gif|png|jpg)$/,
      exclude: /node_modules/,
			loader: 'url'
		}]
	},
	resolve: {
		modules: [__dirname, 'node_modules'],
		extensions: [".js", ".json", ".jsx"],
		alias: {
			// 组件
			'component.pagination': 'src/components/pagination/pagination',
			'component.comment': 'src/components/comment/comment',
			'component.return-top': 'src/components/return-top/return-top',
			// 模块
			'module.tips': 'src/js/modules/tips',
			'module.url': 'src/js/modules/url',
			'module.api': 'src/js/modules/api',
      'module.load-comment': 'src/js/modules/load-comment',
      'module.load-return-top': 'src/js/modules/load-return-top',
			// 框架
			'react': 'node_modules/react/dist/react.min',
			'react-dom': 'node_modules/react-dom/dist/react-dom.min',
		}
	},
	resolveLoader: {
		moduleExtensions: ["-loader"]
	},
  watch: true,
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: './node_modules/',
  },
	devtool: 'cheap-module-eval-source-map'
};

module.exports = webpackConfig;
