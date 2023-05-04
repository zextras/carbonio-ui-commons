/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useNotify, useRefresh } from '@zextras/carbonio-shell-ui';
import { filter, forEach, map, reject } from 'lodash';
import { useEffect } from 'react';
import { getFolderRequest } from '../soap/get-folder';
import { getShareInfoRequest } from '../soap/get-share-info';
import { useFolderStore } from '../store/zustand/folder';
import { FolderView } from '../types/folder';
import { folderWorker } from '../worker';

const getFoldersByAccounts = async (sharedAccounts: unknown[], view: FolderView): Promise<any> =>
	Promise.all(
		map(sharedAccounts, async ({ ownerEmail }: { ownerEmail: string }) => {
			const response = await getFolderRequest({ view }, ownerEmail);
			if (response?.folder?.length) {
				return {
					...response.folder[0],
					oname: response.folder[0].name,
					owner: ownerEmail,
					name: ownerEmail
				};
			}
			return response;
		})
	);

export const useFoldersController = (view: FolderView): void => {
	const refresh = useRefresh();
	const notify = useNotify();

	useEffect(() => {
		if (refresh && view) {
			getFolderRequest({ view }).then((rootFolders: { folder: any }) => {
				getShareInfoRequest().then((sharedFolders: { folders: any }) => {
					if (sharedFolders?.folders) {
						const sharedAccounts = filter(sharedFolders.folders, ['folderId', 1]);
						getFoldersByAccounts(sharedAccounts, view).then((response) => {
							const filteredLinks = reject(rootFolders.folder[0].link, ['rid', 1]);
							const folders = [
								{
									...rootFolders.folder[0],
									link: [...filteredLinks, ...response]
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
	}, [refresh, view]);

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
