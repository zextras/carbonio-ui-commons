/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { waitFor } from '@testing-library/react';
import { rest } from 'msw';

import { useFoldersController } from './use-folders-controller';
import { useFolderStore } from '../store/zustand/folder';
import { getSetupServer } from '../test/jest-setup';
import * as shell from '../test/mocks/carbonio-shell-ui';
import { handleGetFolderRequest } from '../test/mocks/network/msw/handle-get-folder';
import {
	getEmptyMSWShareInfoResponse,
	handleGetShareInfoRequest
} from '../test/mocks/network/msw/handle-get-share-info';
import { setupHook } from '../test/test-setup';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';

const getDifferentViewCreation = (view: FolderView): unknown => {
	if (view === 'appointment' || view === 'contact') {
		return { m: [] };
	}
	return { appt: {} };
};

describe.each<FolderView>(['appointment', 'message', 'contact'])('with %s parameter', (view) => {
	test('on first render it will call refresh', async () => {
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(rest.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useFoldersController, { initialProps: [view] }));
		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).toHaveBeenCalledWith(
			expect.objectContaining({ op: 'refresh', currentView: view, folder: expect.any(Object) })
		);
	});
	test('on rerender it will not call refresh but will call notify', async () => {
		useFolderStore.setState({ folders: {} });
		const notify = { deleted: ['1'], seq: 2 };
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(rest.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));

		shell.useNotify.mockReturnValueOnce([]).mockReturnValueOnce([notify]);
		const { rerender } = await waitFor(() =>
			setupHook(useFoldersController, { initialProps: [view] })
		);
		rerender();

		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(2);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).toHaveBeenCalledWith(
			expect.objectContaining({ op: 'refresh', currentView: view, folder: expect.any(Object) })
		);
		expect(workerSpy).toHaveBeenCalledWith(
			expect.objectContaining({ op: 'notify', notify, state: expect.any(Object) })
		);
	});
	test('if notify is related to another view it wont call the notify', async () => {
		useFolderStore.setState({ folders: {} });
		const notify = { created: getDifferentViewCreation(view as FolderView), seq: 2 };
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(rest.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));

		shell.useNotify.mockReturnValueOnce([]).mockReturnValueOnce([
			// SoapNotify type inside shell is incomplete
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			notify
		]);
		const { rerender } = await waitFor(() =>
			setupHook(useFoldersController, { initialProps: [view] })
		);
		rerender();

		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).not.toHaveBeenCalledWith(
			expect.objectContaining({ op: 'notify', notify, state: expect.any(Object) })
		);
	});
	test('If multiple accounts are available they will be on the same level of the main account', async () => {
		useFolderStore.setState({ folders: {} });
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(rest.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useFoldersController, { initialProps: ['appointment'] }));
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
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(
			rest.post('/service/soap/GetShareInfoRequest', (req, res, ctx) => {
				const response = getEmptyMSWShareInfoResponse();
				return res(ctx.json(response));
			})
		);
		await waitFor(() => setupHook(useFoldersController, { initialProps: ['appointment'] }));
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
