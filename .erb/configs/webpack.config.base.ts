/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'NodeNext',
              moduleResolution: 'NodeNext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    fallback: { path: false },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
