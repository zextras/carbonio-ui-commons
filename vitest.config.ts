/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

process.env.TZ = 'Europe/Rome';

const junitReporter: ['junit', { outputFile: string; console: boolean }] = [
	'junit',
	{ outputFile: 'junit.xml', console: false }
];

export default defineConfig({
	resolve: {
		tsconfigPaths: true
	},
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin']
			}
		})
	],
	define: {
		BASE_PATH: JSON.stringify('/')
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/__test__/vitest-setup.ts'],
		clearMocks: true,
		restoreMocks: true,
		maxWorkers: '50%',
		testTimeout: 20000,
		reporters: ['default', junitReporter],
		coverage: {
			enabled: false,
			provider: 'v8',
			reporter: ['lcov', 'html'],
			reportsDirectory: 'coverage',
			include: ['src/**/*.{js,ts,tsx,jsx}'],
			exclude: [
				'**/__mocks__/**',
				'**/__test__/**',
				'**/tests/**',
				'**/mocks/**',
				'**/*.test.{js,jsx,ts,tsx}'
			]
		},
		environmentOptions: {
			jsdom: {
				url: 'http://localhost'
			}
		},
		exclude: ['**/lib/**', '**/dist/**', '**/build/**', '**/node_modules/**']
	}
});
