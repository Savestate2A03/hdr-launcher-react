const path = require('path');
const { register } = require('tsx/cjs/api');

register({ transpileOnly: true });

require(path.resolve(__dirname, '../../src/main/main.ts'));
