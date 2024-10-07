/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { useInitializeFolders } from './use-initialize-folders';
import { useFolderStore } from '../store/zustand/folder';
import { getSetupServer } from '../test/jest-setup';
import {
	handleFailedRequest,
	handleGetFolderRequest
} from '../test/mocks/network/msw/handle-get-folder';
import {
	getEmptyMSWShareInfoResponse,
	handleGetShareInfoRequest
} from '../test/mocks/network/msw/handle-get-share-info';
import { setupHook } from '../test/test-setup';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';

describe.each<FolderView>(['appointment', 'message', 'contact'])('with %s parameter', (view) => {
	test('it will call refresh', async () => {
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
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
	test('it will call console error when GetFolderRequest fails', async () => {
		const error = jest.spyOn(console, 'error').mockImplementation();
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleFailedRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		expect(workerSpy).toHaveBeenCalledTimes(0);
		await waitFor(() =>
			expect(error).toHaveBeenCalledWith('Error fetching folders:', expect.anything())
		);
	});

	test('it will call console error when GetShareInfoRequest fails', async () => {
		jest.spyOn(console, 'error').mockImplementation();
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleFailedRequest));
		setupHook(useInitializeFolders, { initialProps: [view] });
		expect(workerSpy).toHaveBeenCalledTimes(0);
		await waitFor(() =>
			expect(console.error).toHaveBeenCalledWith('Error fetching folders:', expect.anything())
		);
	});

	test('If multiple accounts are available they will be on the same level of the main account', async () => {
		useFolderStore.setState({ folders: {} });
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
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
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
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
