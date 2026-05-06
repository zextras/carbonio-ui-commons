/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import * as soapLib from '@zextras/carbonio-ui-soap-lib';

export const useSync: ReturnType<typeof vi.fn<() => ReturnType<typeof soapLib.useSync>>> = vi.fn();
export const useInfoRefresh: ReturnType<
	typeof vi.fn<() => ReturnType<typeof soapLib.useInfoRefresh>>
> = vi.fn();

const apiManagerInstance: Omit<soapLib.ApiManager, 'sessionInfo'> = {
	getSessionInfo: vi.fn(),
	setSessionInfo: vi.fn(),
	setPollingPreference: vi.fn(),
	resetPolling: vi.fn(),
	stopPolling: vi.fn()
};

export const ApiManager = {
	getApiManager: (): Omit<soapLib.ApiManager, 'sessionInfo'> => apiManagerInstance
};
