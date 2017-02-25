const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'vue-i18n', 'vuex', 'moment', 'jquery', 'semantic'],
    app: [path.resolve(__dirname, './client/entries/main.js')]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/assets/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader',
      query: {
        minimize: true
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/,
      query: {
        presets: ['es2015'],
        plugins: ['add-module-exports']
      }
    }
    // , {
    //   test: /\.vue$/,
    //   loader: 'vue-loader',
    //   options: {
    //     loaders: {}
    //   }
    // }, {
    //   test: /\.(png|jpg|gif|svg)$/,
    //   loader: 'file-loader',
    //   options: {
    //     name: '[name].[ext]?[hash]'
    //   }
    // }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
      'vue-router': 'vue-router/dist/vue-router.common.js',
      'vue-i18n': 'vue-i18n/dist/vue-i18n.common.js',
      'vuex': 'vuex/dist/vuex.js',
      moment: 'moment/min/moment.min.js',
      '../moment': 'moment/min/moment.min.js',
      semantic: 'semantic-ui/dist/semantic.js'
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
  // devServer: {
  //   historyApiFallback: true,
  //   noInfo: true
  // },
  // performance: {
  //   hints: false
  // },
  // devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
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
}
