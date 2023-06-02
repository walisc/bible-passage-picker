const path = require("path");

module.exports = {
  mode: "development",
  entry: './src/jquery-lib.tsx',
  output: {
    filename: "webpack-output.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ],
        exclude: /node_modules/,
      },
      
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}