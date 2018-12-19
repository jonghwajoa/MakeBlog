const webpack = require('webpack');

module.exports = {
  mode: 'development', // development , production
  entry: {
    app: '.src/bin/www.js',
  },
  output: {
    path: './dist',
    filename: 'www.js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { node: 'current' }, // 노드일 경우만
                modules: 'false',
              },
            ],
            '@babel/preset-stage-0',
          ],
        },
        exclude: ['/node_modules'],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // 아래 EnvironmentPlugin처럼 할 수도 있습니다.
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']), // 요즘은 위의 DefinePlugin보다 이렇게 하는 추세입니다.
  ],
  optimization: {},
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.css', '.ejs'],
  },
};
// webpack4 에서 mode와 optimization 추가됨..?
