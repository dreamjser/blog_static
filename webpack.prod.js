const webpack = require('webpack');
const path = require('path');
const staticCND = 'http://static.dreamjser.com/';

var config = {
  entry: './src/js/entry/',
  bundle: './src/js/bundle/',
  ensure: './src/js/ensure/',
  distEnsure: './dist/js/ensure/'
}

var webpackConfig = {
  entry: {
    home: config.entry + 'home.js',
    files: config.entry + 'files.js',
    article: config.entry + 'article.js',
    tag: config.entry + 'tag.js',
    category: config.entry + 'category.js',
    about: config.entry + 'about.js',
  },
  output: {
    publicPath: staticCND,
    filename: config.bundle + '[name].js',
    chunkFilename: config.distEnsure + '[name].[chunkhash:8].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common'),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      include: [
        /src\/components/,
        /src\/scss/,
      ],
      use: ['style', 'css', 'sass']
    }, {
      test: /\.(js|jsx)$/,
      include: [
        /src\/components/,
        /src\/js\/entry/,
        /src\/js\/modules/,
      ],
      use: ['eslint', 'babel']
    }, {
      test: /\.(gif|png|jpg)$/,
      include: [
        /src\/components/,
        /src\/images/,
      ],
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
    }
  },
  externals: {
    'jquery': 'jQuery',
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  }
};

module.exports = webpackConfig;
