/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useRef } from 'react';

import { useModal } from '@zextras/carbonio-design-system';
import { filter, map, reject } from 'lodash';

import { FolderInitializationErrorModal } from '../components/modals/folder-initialization-error-modal';
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
	const { createModal, closeModal } = useModal();

	const fetchFolders = useCallback(async (): Promise<void> => {
		Promise.all([getFolderRequest({ view }), getShareInfoRequest()])
			.then(async ([getFolderResponse, getShareInfoResponse]): Promise<void> => {
				isLoading.current = true;
				if (getShareInfoResponse.folders) {
					const sharedAccounts = filter(getShareInfoResponse.folders, ['folderId', 1]);
					const filteredLinks = reject(getFolderResponse.folder[0].link, ['rid', 1]);

					const folders = sharedAccounts.length
						? [
								{
									...getFolderResponse.folder[0],
									link: filteredLinks
								},
								...(await getFoldersByAccounts(sharedAccounts, view))
							]
						: [
								{
									...getFolderResponse.folder[0],
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
						folder: getFolderResponse.folder ?? []
					});
				}
			})
			.catch(() => {
				const id = 'error-initialize-modal';
				createModal(
					{
						id,
						children: <FolderInitializationErrorModal onClose={(): void => closeModal(id)} />
					},
					true
				);
			})
			.finally(() => {
				isLoading.current = false;
			});
	}, [closeModal, createModal, view]);

	useEffect(() => {
		if (!isLoading.current && view) {
			fetchFolders();
		}
	}, [fetchFolders, view]);
};
