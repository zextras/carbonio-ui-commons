/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom';

import failOnConsole from 'jest-fail-on-console';
import fetchMock from 'jest-fetch-mock';

import {
	getFailOnConsoleDefaultConfig,
	defaultBeforeAllTests,
	defaultBeforeEachTest,
	defaultAfterEachTest,
	defaultAfterAllTests,
	useLocalStorage
} from './src';

failOnConsole({
	...getFailOnConsoleDefaultConfig(),
	silenceMessage: (message) =>
		message.includes('React does not recognize the `isGeneric` prop on a DOM element')
});

beforeAll(() => {
	fetchMock.doMock();
	defaultBeforeAllTests();
	useLocalStorage.mockReturnValue([jest.fn(), jest.fn()]);
});

beforeEach(() => {
	defaultBeforeEachTest();
});

afterEach(() => {
	defaultAfterEachTest();
});

afterAll(() => {
	defaultAfterAllTests();
});

// Mock matchMedia
// see: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn()
	}))
});

// Mock implementation of window.open
Object.defineProperty(window, 'open', {
	writable: true,
	value: jest.fn()
});

// mock a simplified crypto
Object.defineProperty(window.crypto, 'randomUUID', {
	writable: true,
	value: jest.fn(() => Math.random().toString())
});
