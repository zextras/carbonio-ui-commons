/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json' with { type: 'json' };

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.exports['.'].require,
			format: 'cjs',
			interop: 'compat',
			sourcemap: true,
			inlineDynamicImports: true
		},
		{
			file: pkg.exports['.'].import,
			format: 'esm',
			interop: 'compat',
			sourcemap: true,
			inlineDynamicImports: true
		}
	],
	plugins: [
		nodeResolve({
			extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx', '.jsx']
		}),
		commonjs(),
		babel({
			babelHelpers: 'runtime',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			ignore: ['node_modules', 'lib']
		}),
		postcss(),
		{
			name: 'ignore-assets',
			resolveId(source) {
				if (source.endsWith('.svg') || source.endsWith('.mp3')) return source;
				return null;
			},
			load(id) {
				if (id.endsWith('.svg') || id.endsWith('.mp3')) return 'export default {};';
				return null;
			}
		},
		json()
	],
	external: [
		'react',
		'react-dom',
		'react-i18next',
		'react-router-dom',
		'lodash',
		'@zextras/carbonio-design-system',
		'@zextras/carbonio-shell-ui',
		/@emotion\/.*$/,
		/@mui\/.*$/,
		'core-js',
		'uuid',
		'zustand',
		'i18next',
		'immer',
		'@zextras/carbonio-ui-soap-lib'
	]
};
