/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { useFolderStore } from '../store/zustand/folder';
import { getSetupServer } from '../test/jest-setup';
import { handleGetFolderRequest } from '../test/mocks/network/msw/handle-get-folder';
import { handleGetShareInfoRequest } from '../test/mocks/network/msw/handle-get-share-info';
import { setupHook } from '../test/test-setup';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';
import { useFoldersController } from './use-folders-controller';
import * as shell from '../test/mocks/carbonio-shell-ui';

const getDifferentViewCreation = (view: FolderView): unknown => {
	if (view === 'appointment' || view === 'contact') {
		return { m: [] };
	}
	return { appt: {} };
};

describe.each(['appointment', 'message', 'contact'])('with %s parameter', (view: string) => {
	test('on first render it will call refresh', async () => {
		const workerSpy = jest.spyOn(folderWorker, 'postMessage');
		getSetupServer().use(rest.post('/service/soap/GetFolderRequest', handleGetFolderRequest));
		getSetupServer().use(rest.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		await waitFor(() => setupHook(useFoldersController, { initialProps: view }));
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
			setupHook(useFoldersController, { initialProps: view })
		);
		rerender(() => useFoldersController(view as FolderView));

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
			setupHook(useFoldersController, { initialProps: view })
		);
		rerender(() => useFoldersController(view as FolderView));

		expect(workerSpy).toHaveBeenCalled();
		expect(workerSpy).toHaveBeenCalledTimes(1);
		expect(workerSpy).not.toHaveBeenCalledWith(undefined);
		expect(workerSpy).not.toHaveBeenCalledWith(
			expect.objectContaining({ op: 'notify', notify, state: expect.any(Object) })
		);
	});
});
