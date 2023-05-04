/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { FOLDERS, useNotify, useRefresh } from '@zextras/carbonio-shell-ui';
import { filter, forEach, map, reject } from 'lodash';
import { useEffect } from 'react';
import { getFolderRequest } from '../soap/get-folder';
import { getShareInfoRequest } from '../soap/get-share-info';
import { useFolderStore } from '../store/zustand/folder';
import { folderWorker } from '../worker';

const getFoldersByAccounts = async (requests: unknown[]): Promise<any> =>
	Promise.all(
		map(requests, async ({ id, account }: { id: string; account: string }) => {
			const response = await getFolderRequest({ id }, account);
			if (response?.folder?.length) {
				return {
					...response.folder[0],
					oname: response.folder[0].name,
					owner: account,
					name: account
				};
			}
			return response;
		})
	);

export const useFoldersController = (): void => {
	const refresh = useRefresh();
	const notify = useNotify();

	useEffect(() => {
		if (refresh) {
			getFolderRequest({ id: FOLDERS.USER_ROOT }).then((rootFolders: { folder: any }) => {
				getShareInfoRequest().then((sharedFolders: { folders: any }) => {
					if (sharedFolders?.folders) {
						const sharedAccounts = filter(sharedFolders.folders, ['folderId', 1]);
						const requests = map(sharedAccounts, (acc) => {
							const id = acc.folderId;
							const account = acc.ownerEmail;
							return {
								id,
								account
							};
						});
						getFoldersByAccounts(requests).then((response) => {
							const filteredFolders = reject(rootFolders.folder[0].link, ['rid', 1]);
							const folders = [
								{
									...rootFolders.folder[0],
									link: [...filteredFolders, ...response]
								}
							];
							folderWorker.postMessage({
								op: 'refresh',
								folder: folders ?? []
							});
						});
					}
				});
			});
		}
	}, [refresh]);

	useEffect(() => {
		if (notify?.length) {
			forEach(notify, (item) => {
				folderWorker.postMessage({
					op: 'notify',
					notify: item,
					state: useFolderStore.getState().folders
				});
			});
		}
	}, [notify]);
};
