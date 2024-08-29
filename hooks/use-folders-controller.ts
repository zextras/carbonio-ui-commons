/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useEffect, useRef } from 'react';

import { useNotify } from '@zextras/carbonio-shell-ui';
import { filter, forEach, isEmpty, map, reject, sortBy } from 'lodash';

import { getFolderRequest } from '../soap/get-folder';
import { getShareInfoRequest } from '../soap/get-share-info';
import { useFolderStore } from '../store/zustand/folder';
import { FolderView } from '../types';
import { folderWorker } from '../worker';

const getFoldersByAccounts = async (sharedAccounts: unknown[], view: FolderView): Promise<any> => {
	try {
		return await Promise.all(
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
	} catch (error) {
		console.error('Error fetching folders by accounts:', error);
		return [];
	}
};

export const useFoldersController = (view: FolderView): void => {
	const isLoading = useRef(false);
	const seq = useRef(-1);

	const notify = useNotify();

	const fetchFolders = useCallback(async (): Promise<void> => {
		try {
			isLoading.current = true;
			const folderResponse = await getFolderRequest({ view });
			const shareInfoResponse = await getShareInfoRequest();
			if (shareInfoResponse?.folders) {
				const sharedAccounts = filter(shareInfoResponse.folders, ['folderId', 1]);
				const filteredLinks = reject(folderResponse.folder[0].link, ['rid', 1]);

				const folders = sharedAccounts.length
					? [
							{
								...folderResponse.folder[0],
								link: filteredLinks
							},
							...(await getFoldersByAccounts(sharedAccounts, view))
						]
					: [
							{
								...folderResponse.folder[0],
								link: filteredLinks
							}
						];

				folderWorker.postMessage({
					op: 'refresh',
					currentView: view,
					folder: folders ?? []
				});
			} else {
				folderWorker.postMessage({
					op: 'refresh',
					currentView: view,
					folder: folderResponse?.folder ?? []
				});
			}
		} catch (error) {
			console.error('Error in fetching folder data:', error);
		} finally {
			isLoading.current = false;
		}
	}, [view]);

	useEffect(() => {
		if (!isLoading.current && view) {
			fetchFolders();
		}
	}, [fetchFolders, view]);

	useEffect(() => {
		if (!isLoading.current && notify.length > 0) {
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
	}, [notify, view]);
};
