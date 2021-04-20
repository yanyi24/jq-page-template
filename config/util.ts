import HtmlWebpackPlugin from "html-webpack-plugin";
import {glob} from "glob";

export function generatePageList(isProd: boolean): HtmlWebpackPlugin[] {
  try {
    const files = glob.sync('src/pages/*');
    if (files.length) {
      return files.map(item => {
        const name = item.split('/').pop();
        return new HtmlWebpackPlugin({
          title: name,
          template: `./${item}/index.ejs`,
          filename: `${name}.html`,
          chunks: [name!, 'public'],
          minify: isProd ? {
            collapseWhitespace: true,
            removeComments: true
          } : {}
        });
      });
    }
    return [];
  } catch (error) {
    throw error;
  }
}

export function generateEntry(): {[key: string]: string} {
  try {
    const files = glob.sync('src/pages/*');
    const entry: {[key: string]: string} = {'public': './src/assets/scripts/public.ts'};
    if (files.length) {
      files.map(item => {
        const name = item.split('/').pop();
        entry[name!] = `./${item}/index.ts`
      });
    }
    return entry;
  } catch (error) {
    throw error;
  }
}
