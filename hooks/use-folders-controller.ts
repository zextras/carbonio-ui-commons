/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect, useRef } from 'react';

import { useNotify } from '@zextras/carbonio-shell-ui';
import { filter, forEach, isEmpty, map, reject, sortBy } from 'lodash';

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

export const useFoldersController = (view: FolderView): null => {
	const initializing = useRef(true);
	const seq = useRef(-1);

	const notify = useNotify();

	useEffect(() => {
		if (view) {
			initializing.current = false;
			getFolderRequest({ view }).then((getFolderResponse: { folder: any }) => {
				getShareInfoRequest().then((sharedFolders) => {
					if (sharedFolders?.folders) {
						const sharedAccounts = filter(sharedFolders.folders, ['folderId', 1]);
						if (sharedAccounts.length) {
							const filteredLinks = reject(getFolderResponse.folder[0].link, ['rid', 1]);
							getFoldersByAccounts(sharedAccounts, view).then((response) => {
								if (!response.Fault) {
									const folders = [
										{
											...response.folder[0],
											link: filteredLinks
										},
										...response
									];
									folderWorker.postMessage({
										op: 'refresh',
										currentView: view,
										folder: folders ?? []
									});
								} else {
									const folders = [
										{
											...response.folder[0],
											link: filteredLinks
										}
									];
									folderWorker.postMessage({
										op: 'refresh',
										currentView: view,
										folder: folders ?? []
									});
								}
							});
						} else {
							folderWorker.postMessage({
								op: 'refresh',
								currentView: view,
								folder: getFolderResponse?.folder ?? []
							});
						}
					}
				});
			});
		}
	}, [view]);

	useEffect(() => {
		if (!initializing.current && notify.length > 0) {
			forEach(sortBy(notify, 'seq'), (item) => {
				if (!isEmpty(notify) && (item.seq > seq.current || (seq.current > 1 && item.seq === 1))) {
					const isNotifyRelatedToFolders =
						!isEmpty(notify) &&
						(item?.created?.folder ||
							item?.modified?.folder ||
							item.deleted ||
							item?.created?.link ||
							item?.modified?.link);

					if (isNotifyRelatedToFolders) {
						folderWorker.postMessage({
							op: 'notify',
							notify: item,
							state: useFolderStore.getState().folders
						});
					}
					seq.current = item.seq;
				}
			});
		}
	}, [initializing, notify, seq, view]);
	return null;
};
