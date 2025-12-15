import webpackPaths from '../configs/webpack.paths';

const rimraf = require('rimraf');

const foldersToRemove = [
  webpackPaths.distPath,
  webpackPaths.buildPath,
  webpackPaths.dllPath,
];

foldersToRemove.forEach((folder) => {
  rimraf.sync(folder);
});
