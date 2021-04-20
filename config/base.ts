import {resolve}  from "path";
import { Configuration } from "webpack";
import {generateEntry} from "./util";

const assetsRoot = 'assets'


export default {
  entry: generateEntry(),
  output: {
    path: resolve(__dirname, '../dist'),
    filename: `${assetsRoot}/js/[name].[contenthash:8].js`
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devServer: {
    port: 8888,
    index: 'home.html'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true // 自动fix
        }
      },
      {
        oneOf: [
          {
            test: /\.(png|jpg|gif|jpeg|svg)$/,
            loader: 'url-loader',
            options: {
              limit: 5 * 1024,
              name: '[name].[contenthash:8].[ext]',
              outputPath: `${assetsRoot}/images`
            }
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
              esModule: false
            }
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  esModule: false
                }
              }
            ]
          },
          {
            test: /\.ejs$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  esModule: false
                }
              },
              {
                loader: 'ejs-html-loader',
                options: {
                  production: process.env.ENV === 'production'
                }
              }
            ]
          },
          {
            test: /\.(eot|ttf|svg|woff|woff2)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: `${assetsRoot}/fonts`
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all' // 抽离公共引入的库
    }
  },
  externals: {
    // 忽略库名： npm包名
    jquery: 'jQuery'
  }
} as Configuration;
