/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageReporters: ['lcov', 'html'],
	collectCoverageFrom: [
		'src/**/*.{js,ts}(x)?',
		'!**/__mocks__/**', // Exclude mock files
		'!**/__tests__/**', // Exclude test files
		'!**/*.test.{js,jsx,ts,tsx}', // Exclude test files
		'!**/*.spec.{js,jsx,ts,tsx}', // Exclude test files
		'!src/tests/**', // Exclude test files from src/tests
		'!src/**/test/mocks/**' // Exclude test files from src/**/test/mocks
	],
	coverageDirectory: 'coverage',
	coverageProvider: 'babel',
	testTimeout: 20000,
	fakeTimers: {
		enableGlobally: true
	},
	maxWorkers: '50%',
	moduleDirectories: ['node_modules', 'utils'],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/src/__test__/mocks/file-mock.ts',

		uuid: require.resolve('uuid'),
		'\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js'
	},
	reporters: ['default', 'jest-junit'],
	setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
	testEnvironment: '<rootDir>/tests/setup/jsdom-extended.ts',
	testEnvironmentOptions: {
		customExportConditions: ['']
	},
	transform: {
		'^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.jest.js' }]
	}
};

export default config;
