const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'vue',
      'vue-i18n',
      'vue-router',
      'vuex',
      'moment',
      'jquery',
      'semantic'
    ],
    app: (() => {
      const appEntry = [];
      if (process.env.NODE_ENV !== 'production') {
        appEntry.push(path.resolve('client/entries/dev-client.js'));
      }
      return appEntry.concat(path.resolve('client/entries/main.js'));
    })()
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '/assets/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
      'vue-i18n': 'vue-i18n/dist/vue-i18n.common.js',
      'vue-router': 'vue-router/dist/vue-router.common.js',
      'vuex': 'vuex/dist/vuex.js',
      moment: 'moment/moment.js',
      '../moment': 'moment/moment.js',
      semantic: path.resolve('client/semantic/dist/semantic.js')
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
} else {
  module.exports.devtool = '#source-map';
}
