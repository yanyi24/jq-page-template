import { Configuration } from "webpack";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import {generatePageList} from "./util";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

const assetsRoot = 'assets'
const pubCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../../'
    }
  },
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-preset-env')()
        ]
      }
    }
  }
];

export default {
  mode: 'production',
  target: "browserslist",
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...pubCssLoader]
          },
          {
            test: /\.s[ac]ss$/i,
            use: [...pubCssLoader,'sass-loader']
          },
          {
            test: /\.js|ts$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 第二次打包使用缓存
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3
                    },
                    targets: {
                      chrome: '60',
                      firefox: '50',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ]
            }
          }
        ]
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...generatePageList(true),
    new MiniCssExtractPlugin({
      filename: `${assetsRoot}/styles/[name].[hash:6].css`,
      chunkFilename: '[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
} as Configuration;
