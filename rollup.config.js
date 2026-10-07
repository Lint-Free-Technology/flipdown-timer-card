import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;
const port = process.env.PORT || 5000;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: port,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  esbuild({
    minify: !dev,
    target: 'es2017',
    tsconfig: './tsconfig.json',
  }),
  json(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  dev && serve(serveopts),
];

export default [
  {
    input: 'src/flipdown-timer-card.ts',
    output: {
      dir: './dist',
      format: 'es',
      sourcemap: dev ? true : false,
    },
    plugins: [...plugins],
    watch: {
      exclude: 'node_modules/**',
    },
    context: 'window',
  },
];
