import merge from "webpack-merge";
import prod from "./prod";
import dev from "./dev";
import base from "./base";
import {Configuration} from "webpack";

export default (env: Record<string, boolean | string | number>): Configuration => {
  const isProd = env.production === true;

  if (isProd) {
    return merge(base, prod);
  } else {
    return merge(base, dev);
  }
}
