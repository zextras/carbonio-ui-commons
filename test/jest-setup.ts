/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import failOnConsole from 'jest-fail-on-console';
import fetchMock from 'jest-fetch-mock';
import { setupServer, SetupServerApi } from 'msw/node';
import { getRestHandlers } from './mocks/network/msw/handlers';

let server: SetupServerApi;

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

export const getSetupServerApi = (): SetupServerApi => server;
