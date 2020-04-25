const path = require("path");
const GasPlugin = require("gas-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./__tests__/integrate/index.ts",
  devtool: false,
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist_test"),
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
    },
  },
  plugins: [
    new GasPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: "./appsscript.json", to: "./" }]),
  ],
};
