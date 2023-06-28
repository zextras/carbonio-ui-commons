/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { times } from 'lodash';
import { getFolderIdParts } from '../../../../helpers/folders';
import { Folder } from '../../../types/folder';
import { useFolderStore } from './store';

/**
 *
 * @param suffix
 * @param folder
 */
const renumFolder = (suffix: string, folder: Folder): Folder => ({
	...folder,
	name: `${folder.name} - copy ${suffix}`,
	absFolderPath: `${folder.absFolderPath} - copy ${suffix}`,
	uuid: `${folder.uuid}-${suffix}`,
	id: `${folder.uuid}-${suffix}:${getFolderIdParts(folder.id).id}`,
	parent: folder.parent && `${folder.uuid}:${getFolderIdParts(folder.parent).id}`,
	children: folder.children ? folder.children.map((child) => renumFolder(suffix, child)) : []
});

/**
 * @param count
 */
export const duplicateFolders = (count: number): void => {
	const result: Record<string, Folder> = {};

	Object.values(useFolderStore.getState().folders).forEach((folder) => {
		if (!getFolderIdParts(folder.id).zid) {
			return;
		}
		times(count, (i) => {
			const duplicate = renumFolder(`${i}`, { ...folder });
			result[duplicate.id] = duplicate;
		});
	});

	const state = useFolderStore.getState();
	useFolderStore.setState({
		...state,
		folders: {
			...state.folders,
			...result
		}
	});
};
