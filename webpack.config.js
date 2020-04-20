const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  devtool: false,
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    alias: {
      src: path.resolve(__dirname, "./src"),
      mocks: path.resolve(__dirname, "./__mocks__"),
      testhelper: path.resolve(__dirname, "./__testhelper__"),
    },
  },
  plugins: [new CleanWebpackPlugin()],
};
