/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useEffect, useRef } from 'react';

import { filter, map, reject } from 'lodash';

import { getFolderRequest } from '../soap/get-folder';
import { getShareInfoRequest } from '../soap/get-share-info';
import { FolderView } from '../types';
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

export const useInitializeFolders = (view: FolderView): void => {
	const isLoading = useRef(false);

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
};
