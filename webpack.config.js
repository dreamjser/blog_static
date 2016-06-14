'use strict';

const webpack = require('webpack');
const path = require('path');
const HOST = 'http://static.dreamjser.com';
var env = process.env.NODE_ENV || 'development';

var config = {
	entry: './src/js/entry/',
	bundle: './src/js/bundle/',
	ensure: './src/js/ensure/',
	ensureJs: 'ensure-[id].js'
}

// 生产
if (env == 'production') {
	config.ensure = './dist/js/ensure/';
	config.ensureJs = 'ensure-[chunkhash].js';
}

var webpackConfig = {
	entry: {
		home: config.entry + 'home.js',
		files: config.entry + 'files.js',
		article: config.entry + 'article.js',
    tag: config.entry + 'tag.js',
    category: config.entry + 'category.js',
    about: config.entry + 'about.js'
	},
	output: {
		publicPath: HOST,
		filename: config.bundle + '[name].js',
		chunkFilename: config.ensure + config.ensureJs
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(config.bundle + 'common.js')
	],
	debug: true,
	module: {
		loaders: [{
			test: /\.scss$/,
			loader: 'style!css!sass'
		}, {
			test: /\.(js|jsx)$/,
			loader: 'babel',
			query: {
				cacheDirectory: true,
				presets: ['es2015', 'react']
			}
		}, {
			test: /\.(gif|png|jpg)$/,
			loader: 'url'
		}]
	},
	resolve: {
		root: __dirname,
		alias: {
			'component.pagination': 'src/components/pagination/pagination.jsx',
			'component.comment': 'src/components/comment/comment.jsx',
			'module.tips': 'src/js/modules/tips.js',
			'module.url': 'src/js/modules/url.js'
		}
	}
};

// 开发
if (env == 'development') {
	webpackConfig.devtool = 'eval';
}

module.exports = webpackConfig;
