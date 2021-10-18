import { createRequire } from "module";
import { URL } from "url";
import webpack from "webpack";

const require = createRequire(import.meta.url);

export default {
  mode: "development",
  entry: ".",
  target: "web",
  output: {
    filename: "bundle.js",
    path: new URL("dist", import.meta.url).pathname,
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};
