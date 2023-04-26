/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import failOnConsole from 'jest-fail-on-console';
import fetchMock from 'jest-fetch-mock';
import { noop } from 'lodash';
import { setupServer, SetupServer } from 'msw/node';
import { getRestHandlers } from './mocks/network/msw/handlers';

let server: SetupServer;

/**
 * Returns the default configuration for jest failOnConsole setting
 */
export const getFailOnConsoleDefaultConfig = (): failOnConsole.InitOptions => ({
	shouldFailOnError: true,
	shouldFailOnWarn: true
});

/**
 * Default logic to execute before all the tests
 */
export const defaultBeforeAllTests = (): void => {
	fetchMock.doMock();
	server = setupServer(...getRestHandlers());
	server.listen({ onUnhandledRequest: 'warn' });
};

/**
 * Default logic to execute before each tests
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const defaultBeforeEachTest = (): void => {};

/**
 * Default logic to execute after each tests
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const defaultAfterEachTest = (): void => {
	jest.clearAllTimers();
};

/**
 * Default logic to execute after all the tests
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const defaultAfterAllTests = (): void => {
	server.resetHandlers();
	server.close();
};

export const getSetupServer = (): SetupServer => server;

window.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn()
}));

/**
 * Mocks the Worker class
 *
 * workers are not supported in jest, as they are a browser feature and are not supported in jsdom
 * I did not find a way to type this class, so I disabled the eslint rule
 */
export default class Worker {
	constructor(stringUrl: string) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.url = stringUrl;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.onmessage = noop;
	}

	postMessage(msg: string): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.onmessage(msg);
	}
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Worker = Worker;

// mock a simplified Intersection Observer
Object.defineProperty(window, 'IntersectionObserver', {
	writable: false,
	value: jest.fn().mockImplementation(
		(
			callback: IntersectionObserverCallback,
			options?: IntersectionObserverInit
		): IntersectionObserver => ({
			thresholds: (options?.threshold || [0]) as typeof IntersectionObserver.prototype.thresholds,
			root: options?.root || window.document,
			rootMargin: options?.rootMargin || '0px',
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
			takeRecords: (): IntersectionObserverEntry[] => []
		})
	)
});
