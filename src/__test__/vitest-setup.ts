/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom';

import { beforeAll, afterEach, afterAll } from 'vitest';
import moment from 'moment-timezone';

import { noop } from 'lodash';
import { setupServer, SetupServer } from 'msw/node';

import { getRestHandlers } from './mocks/network/msw/handlers';
import { VITEST_DEFAULT_TIMEZONE } from './constants';

vi.mock('@zextras/carbonio-shell-ui');
vi.mock('@zextras/carbonio-ui-preview');

let server: SetupServer;

/**
 * Returns the default configuration for vitest failOnConsole setting
 */
export const getFailOnConsoleDefaultConfig = (): {
	shouldFailOnError: boolean;
	shouldFailOnWarn: boolean;
} => ({
	shouldFailOnError: true,
	shouldFailOnWarn: true
});

const failOnConsoleConfig = getFailOnConsoleDefaultConfig();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

if (failOnConsoleConfig.shouldFailOnError) {
	console.error = (...args: unknown[]): never => {
		const message = String(args[0] || '');
		if (message.includes('React does not recognize the `isGeneric` prop on a DOM element')) {
			originalConsoleError.apply(console, args);
			return undefined as never;
		}
		originalConsoleError.apply(console, args);
		throw new Error(`console.error was called: ${message}`);
	};
}

if (failOnConsoleConfig.shouldFailOnWarn) {
	console.warn = (...args: unknown[]): never => {
		const message = String(args[0] || '');
		originalConsoleWarn.apply(console, args);
		throw new Error(`console.warn was called: ${message}`);
	};
}

class Worker {
	url: string;

	onmessage: (msg: string) => void;

	constructor(stringUrl: string) {
		this.url = stringUrl;
		this.onmessage = noop;
	}

	postMessage(msg: string): void {
		this.onmessage(msg);
	}
}

Object.defineProperty(window, 'Worker', {
	writable: true,
	value: Worker
});

Object.defineProperty(window, 'open', {
	writable: true,
	value: vi.fn()
});

Object.defineProperty(window.crypto, 'randomUUID', {
	writable: true,
	value: vi.fn(() => Math.random().toString())
});

// see: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn()
	}))
});

export const getSetupServer = (): SetupServer => server;

window.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

beforeAll(() => {
	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		value: vi.fn(function intersectionObserverMock(
			callback: IntersectionObserverCallback,
			options: IntersectionObserverInit
		) {
			return {
				thresholds: options.threshold,
				root: options.root,
				rootMargin: options.rootMargin,
				observe: vi.fn(),
				unobserve: vi.fn(),
				disconnect: vi.fn()
			};
		})
	});

	server?.close();

	server = setupServer(...getRestHandlers());
	server.listen({ onUnhandledRequest: 'warn' });
});

beforeEach(() => {
	moment.tz.setDefault(VITEST_DEFAULT_TIMEZONE);
	moment.tz.guess = vi.fn().mockImplementation(() => VITEST_DEFAULT_TIMEZONE);
	const originalDateResolvedOptions = new Intl.DateTimeFormat().resolvedOptions();

	vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
		...originalDateResolvedOptions,
		timeZone: VITEST_DEFAULT_TIMEZONE
	});
	vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});

afterAll(() => {
	server.resetHandlers();
	server.close();
});
