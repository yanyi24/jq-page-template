import { Configuration } from "webpack";
import {generatePageList} from "./util";
import {resolve} from "path";

const pubCssLoader = [
  'style-loader',
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
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    watchContentBase: true,
    port: 8888,
    index: 'demo.html',
    hot: true, // HMR
    proxy: {
      "/api": {
        target: "http://localhost:3333",
        pathRewrite: {"/api": ""}
      }
    }
  },
  target: "web",
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
          }
        ]
      }
    ]
  },
  plugins: [
    ...generatePageList(false)
  ]
} as Configuration;
