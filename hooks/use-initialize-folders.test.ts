/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { waitFor } from '@testing-library/react';
import { useModal } from '@zextras/carbonio-design-system';
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
	handleEmptyGetShareInfoRequest,
	handleGetShareInfoRequest
} from '../test/mocks/network/msw/handle-get-share-info';
import { setupHook } from '../test/test-setup';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';

jest.mock('@zextras/carbonio-design-system', () => ({
	...jest.requireActual('@zextras/carbonio-design-system'),
	useModal: jest.fn()
}));

describe.each<FolderView>(['appointment', 'message', 'contact'])('with %s parameter', (view) => {
	test('it will call refresh', async () => {
		(useModal as jest.Mock).mockImplementation(() => ({ createModal: jest.fn() }));
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).toHaveBeenCalledWith(
			expect.objectContaining({ op: 'refresh', currentView: view, folder: expect.any(Object) })
		);
	});
	test('it will open error-initialize-modal when GetFolderRequest fails', async () => {
		const createModalSpy = jest.fn();
		(useModal as jest.Mock).mockImplementation(() => ({ createModal: createModalSpy }));
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleFailedRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		expect(workerSpy).toHaveBeenCalledTimes(0);
		expect(createModalSpy).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'error-initialize-modal' }),
			true
		);
	});

	test('it will open error-initialize-modal  when GetShareInfoRequest fails', async () => {
		const createModalSpy = jest.fn();
		(useModal as jest.Mock).mockImplementation(() => ({ createModal: createModalSpy }));
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleFailedRequest));
		await waitFor(() => setupHook(useInitializeFolders, { initialProps: [view] }));
		expect(workerSpy).toHaveBeenCalledTimes(0);
		expect(createModalSpy).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'error-initialize-modal' }),
			true
		);
	});
	it('should not open the error modal when getShareInfo returns an empty array', async () => {
		const createModalSpy = jest.fn();
		useFolderStore.setState({ folders: {} });
		getSetupServer().use(http.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(
			http.post('/service/soap/GetShareInfoRequest', handleEmptyGetShareInfoRequest)
		);
		await waitFor(() =>
			setupHook(useInitializeFolders, {
				initialProps: ['message']
			})
		);
		expect(createModalSpy).not.toHaveBeenCalled();
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
		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
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
		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				op: 'refresh',
				currentView: 'appointment',
				folder: [expect.objectContaining({ id: '1' })]
			})
		);
	});
});
