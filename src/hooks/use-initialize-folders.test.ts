/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { act, waitFor } from '@testing-library/react';
import { useModal } from '@zextras/carbonio-design-system';
import { ApiManager } from '@zextras/carbonio-ui-soap-lib';
import { http, HttpResponse } from 'msw';

import { useInitializeFolders } from './use-initialize-folders';
import { getSetupServer } from '../__test__/vitest-setup';
import { createSoapAPIInterceptor } from '../__test__/mocks/network/msw/create-api-interceptor';
import {
	handleFailedRequest,
	handleGetFolderRequest
} from '../__test__/mocks/network/msw/handle-get-folder';
import {
	getEmptyMSWShareInfoResponse,
	handleEmptyGetShareInfoRequest,
	handleGetShareInfoRequest
} from '../__test__/mocks/network/msw/handle-get-share-info';
import { getMocksContext } from '../__test__/mocks/utils/mocks-context';
import { setupHook } from '../__test__/test-setup';
import { useFolderStore } from '../store/zustand/folder/store';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';

vi.mock('@zextras/carbonio-design-system', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as object),
		useModal: vi.fn().mockReturnValue({ createModal: vi.fn(), closeModal: vi.fn() })
	};
});

beforeAll(() => {
	ApiManager.getApiManager().setSessionInfo({
		accountId: getMocksContext().identities.primary.identity.id,
		accountName: getMocksContext().identities.primary.identity.email,
		session: {
			id: faker.number.int(),
			_content: faker.number.int()
		},
		carbonioVersion: faker.word.words(10),
		legacyRefreshInfo: {}
	});
});

describe.each<FolderView>(['appointment', 'message', 'contact'])('with %s parameter', (view) => {
	test('it will call refresh', async () => {
		(useModal as ReturnType<typeof vi.fn>).mockImplementation(() => ({ createModal: vi.fn() }));
		const workerSpy = vi.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		await waitFor(() => {
			expect(workerSpy).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(workerSpy).toHaveBeenCalledTimes(1);
		});
		await waitFor(() => {
			expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		});
		await waitFor(() => {
			expect(workerSpy).toHaveBeenCalledWith(
				expect.objectContaining({ op: 'refresh', currentView: view, folder: expect.any(Object) })
			);
		});
	});
	test('it will open error-initialize-modal when GetFolderRequest fails', async () => {
		const createModalSpy = vi.fn();
		(useModal as ReturnType<typeof vi.fn>).mockImplementation(() => ({
			createModal: createModalSpy
		}));
		const workerSpy = vi.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleFailedRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		await waitFor(() => {
			expect(workerSpy).toHaveBeenCalledTimes(0);
		});
		await waitFor(() => {
			expect(createModalSpy).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'error-initialize-modal' }),
				true
			);
		});
	});

	test('it will open error-initialize-modal  when GetShareInfoRequest fails', async () => {
		const createModalSpy = vi.fn();
		(useModal as ReturnType<typeof vi.fn>).mockImplementation(() => ({
			createModal: createModalSpy
		}));
		const workerSpy = vi.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleFailedRequest));
		setupHook(useInitializeFolders, { initialProps: [view] });
		await waitFor(() => {
			expect(workerSpy).toHaveBeenCalledTimes(0);
		});
		await waitFor(() => {
			expect(createModalSpy).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'error-initialize-modal' }),
				true
			);
		});
	});
	it('should not open the error modal when getShareInfo returns an empty array', async () => {
		const createModalSpy = vi.fn();
		(useModal as ReturnType<typeof vi.fn>).mockImplementation(() => ({
			createModal: createModalSpy
		}));
		useFolderStore.setState({ folders: {} });
		createSoapAPIInterceptor('NoOp');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(
			http.post('/service/soap/GetShareInfoRequest', handleEmptyGetShareInfoRequest)
		);
		await waitFor(() =>
			setupHook(useInitializeFolders, {
				initialProps: ['message']
			})
		);
		await act(async () => {
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(createModalSpy).not.toHaveBeenCalled();
	});
	test('If multiple accounts are available they will be on the same level of the main account', async () => {
		useFolderStore.setState({ folders: {} });
		const workerSpy = vi.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() =>
			setupHook(useInitializeFolders, {
				initialProps: ['appointment']
			})
		);
		await waitFor(() => expect(workerSpy).toHaveBeenCalled());
		await waitFor(() => expect(workerSpy).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(workerSpy).not.toHaveBeenCalledWith(undefined));
		await waitFor(() =>
			expect(workerSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					op: 'refresh',
					currentView: 'appointment',
					folder: expect.arrayContaining([
						// main account id
						expect.objectContaining({ id: '1' }),
						// shared account id
						expect.objectContaining({ id: expect.stringContaining(':1') })
					])
				})
			)
		);
	});

	test('If only main account is available postMessage will be called with an array with 1 item', async () => {
		useFolderStore.setState({ folders: {} });
		const workerSpy = vi.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(
			http.post('/service/soap/GetShareInfoRequest', () => {
				const response = getEmptyMSWShareInfoResponse();
				return HttpResponse.json(response);
			})
		);
		await waitFor(() =>
			setupHook(useInitializeFolders, {
				initialProps: ['appointment']
			})
		);
		await waitFor(() => expect(workerSpy).toHaveBeenCalled());
		await waitFor(() => expect(workerSpy).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(workerSpy).not.toHaveBeenCalledWith(undefined));
		await waitFor(() =>
			expect(workerSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					op: 'refresh',
					currentView: 'appointment',
					folder: [expect.objectContaining({ id: '1' })]
				})
			)
		);
	});
});
