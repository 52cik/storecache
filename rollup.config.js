import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

import { version, author, license } from './package.json';

const banner = `
/*!
 * StoreCache v${version}
 * (c) 2018-${new Date().getFullYear()} ${author}
 * Released under the ${license} License.
 */
`.trim();

export default [
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/store-cache.js', // 生成未压缩的
      format: 'umd',
      name: 'StoreCache',
      banner
    },
    plugins: [commonjs()]
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/store-cache.min.js', // 生成要是版本
      format: 'umd',
      name: 'StoreCache'
    },
    plugins: [commonjs(), uglify({ output: { preamble: banner } })]
  }
];
