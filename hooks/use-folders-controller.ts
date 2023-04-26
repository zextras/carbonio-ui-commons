/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { FOLDERS, useNotify, useRefresh } from '@zextras/carbonio-shell-ui';
import { filter, forEach, map } from 'lodash';
import { useEffect, useState } from 'react';
import { getFolderRequest } from '../soap/get-folder';
import { getShareInfoRequest } from '../soap/get-share-info';
import { useFolderStore } from '../store/zustand/folder';
import { folderWorker } from '../worker';

// TODO: the current soapFetch implementation in shell does not support custom headers,
//  we can replace this fetch with the soapFetch once its header can be customized.
const getFoldersByAccount = (body: unknown, header: { account: string }): Promise<any> =>
	fetch(`/service/soap/GetFolderRequest`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Body: {
				GetFolderRequest: body
			},
			Header: {
				context: {
					_jsns: 'urn:zimbra',
					account: {
						_content: header.account,
						by: 'name'
					}
				}
			}
		})
	})
		.then((res) => res?.json())
		.then((res) => {
			const responseFolder = res.Body.GetFolderResponse.folder[0];
			return res?.Body?.Fault
				? res.Body
				: { ...responseFolder, oname: responseFolder.name, owner: header.account };
		})
		.catch((e) => {
			throw e;
		});

const getFoldersByAccounts = async (requests: unknown[]): Promise<any> =>
	Promise.all(map(requests, ({ body, header }) => getFoldersByAccount(body, header)));

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
							const body = {
								_jsns: 'urn:zimbraMail',
								folder: {
									l: acc.folderId
								}
							};
							const header = {
								account: acc.ownerEmail
							};
							return {
								body,
								header
							};
						});
						getFoldersByAccounts(requests).then((response) => {
							const folders = [
								{
									...rootFolders.folder[0],
									link: [...rootFolders.folder[0].link, ...response]
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
