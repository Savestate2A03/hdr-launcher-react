import webpackPaths from '../configs/webpack.paths';

const rimraf = require('rimraf');
const path = require('path');

export default function deleteSourceMaps() {
  rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'), {
    glob: true,
  });
  rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'), {
    glob: true,
  });
}
