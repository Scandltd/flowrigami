import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';


const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig: webpack.Configuration = {
  devtool: isProduction ? false : 'cheap-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'flowrigami.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: [
          'raw-loader',
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            collapseWhitespace: isProduction,
            minimize: isProduction,
          }
        }
      },
    ],
  },
  optimization: {
    concatenateModules: isProduction,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            beautify: false,
            comments: false,
          }
        },
        extractComments: false,
        sourceMap: false
      })
    ],
    noEmitOnErrors: true,
  },
  resolve: {
    alias: {
      '@app': path.join(__dirname, 'src'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.tsx', '.ts'],
  },

  devServer: {
    compress: true,
    host: '0.0.0.0',
    port: 9000,

    stats: {
      colors: true,
      errors: true,
      reasons: false,
      warnings: true,

      assets: false,
      chunks: false,
      children: false,
      entrypoints: true,
      hash: false,
      modules: false,
      timings: false,
      version: false
    }
  }
};

export default webpackConfig;
