/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FOLDERS, ROOT_NAME } from '@zextras/carbonio-shell-ui';
import { filter, find, keyBy, times, values } from 'lodash';
import type { Folder, Folders, LinkFolder, SearchFolder, Searches } from '../../../types/folder';
import { useFolderStore } from './store';
import { getFlatChildrenFolders } from './utils';

/**
 * Returns the folder with given ID or undefined
 * @params id */
export const useFolder = (id: string): Folder | undefined => useFolderStore((s) => s.folders?.[id]);

/**
 * Returns the folder with given ID or undefined
 * @params id */
export const getFolder = (id: string): Folder | undefined =>
	useFolderStore.getState()?.folders?.[id];

/**
 * Returns a folders' map including roots and links. Each folder has its own tree structure included inside its children
 */
export const useFoldersMap = (): Folders => useFolderStore((s) => s.folders);

/**
 * Returns a folders' array including roots and links. Each folder has its own tree structure included inside its children
 */
export const useFoldersArray = (): Array<Folder> => useFolderStore((s) => values(s.folders));

/**
 * Returns a folders' map including roots and links. Each folder has its own tree structure included inside its children
 */
export const getFoldersMap = (): Folders => useFolderStore.getState().folders;

/**
 * Returns a folders' array including roots and links. Each folder has its own tree structure included inside its children
 */
export const getFoldersArray = (): Array<Folder> => values(useFolderStore.getState().folders);

/**
 * Returns a folders' array including only links. Each folder has its own tree structure included inside its children
 */
export const getLinksArray = (view?: string): Array<LinkFolder> =>
	filter(values(useFolderStore.getState().folders), (folder: Folder) => {
		if (view && folder.view !== view) {
			return false;
		}

		return folder.isLink;
	}) as Array<LinkFolder>;

/**
 * Returns the root account id for a given folder
 * @param folder a Folder or LinkFolder
 * @returns the root account id or null if the folder is not a link or the root folder
 */
function getRootAccountId(folder: Folder | LinkFolder): string {
	const parent = folder?.parent && getFolder(folder.parent);
	if ('oname' in folder && folder?.oname === ROOT_NAME) {
		return folder.id;
	}
	if (parent) {
		return getRootAccountId(parent);
	}
	return folder.id;
}

/**
 * Returns the root folder of the provided folderId or undefined
 * @params id
 * @returns the root folder or undefined
 * */
export const useRoot = (id: string): Folder | undefined =>
	useFolderStore((s) => {
		const folder = s.folders?.[id];
		const rootFolderId = getRootAccountId(folder) || '';
		return s.folders?.[rootFolderId];
	});

/**
 * Returns the root folder of the provided folderId or undefined
 * @params id
 * @returns the root folder or undefined
 * */
export const getRoot = (id: string): Folder | undefined => {
	const folder = useFolderStore.getState().folders?.[id];
	const rootFolderId = getRootAccountId(folder) || '';
	return useFolderStore.getState().folders?.[rootFolderId];
};

/**
 * Returns a roots' array. Each root has its own tree structure included inside its children
 */
export const useRootsArray = (): Array<Folder> =>
	useFolderStore((s) => filter(s.folders, (f) => f.id?.split(':')?.includes(FOLDERS.USER_ROOT)));

/**
 * Returns a roots' array. Each root has its own tree structure included inside its children
 */
export const getRootsArray = (): Array<Folder> =>
	filter(useFolderStore.getState().folders, (f) => f.id?.split(':')?.includes(FOLDERS.USER_ROOT));

/**
 * Returns a roots' map. Each root has its own tree structure included inside its children
 */
export const useRootsMap = (): Record<string, Folder> =>
	useFolderStore((s) =>
		keyBy(
			filter(s.folders, (f) => f.id?.split(':')?.includes(FOLDERS.USER_ROOT)),
			'id'
		)
	);

/**
 * Returns a roots' map. Each root has its own tree structure included inside its children
 */
export const getRootsMap = (): Record<string, Folder> =>
	keyBy(
		filter(useFolderStore.getState().folders, (f) => f.id?.split(':')?.includes(FOLDERS.USER_ROOT)),
		'id'
	);

// ROOTS BY VIEW
/**
 * Returns a root with given user ID.
 * @params userId
 */
export const useRootByUser = (
	userId: string
): Folder | SearchFolder | Record<string, never> | undefined =>
	useFolderStore((s) => find(s.folders, (f) => f.name === userId));

/**
 * Returns a root with given user ID.
 * @params userId
 */
export const getRootByUser = (
	userId: string
): Folder | SearchFolder | Record<string, never> | undefined => {
	const { folders } = useFolderStore.getState();
	return find(folders, (f) => f.name === userId);
};

/**
 * Return a flat array of folder that are children of the given root
 * @param rootId
 */
export const getFoldersArrayByRoot = (rootId: string): Array<Folder> => {
	const root = getRoot(rootId);
	if (!root) {
		return [];
	}

	return Object.values(getFlatChildrenFolders(root.children));
};

// SEARCHES
export const useSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore((s) => s.searches?.[id]);
export const getSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore.getState().searches[id];
export const useSearchFolders = (): Searches => useFolderStore((s) => s.searches);
export const getSearchFolders = (): Searches => useFolderStore.getState().searches;

// useful hooks to update the value of a folder. Created because we don't receive acl data from notify when we modify folder grants.

/**
 * Returns a callback function to update a specific folder.
 *
 * @returns callback function to update a specific folder
 */
export const useUpdateFolder = (): ((id: string, opt: Partial<Folder>) => void) =>
	useFolderStore((s) => s.updateFolder);

/**
 * Returns a callback function to update a specific folder.
 *
 * @returns callback function to update a specific folder
 */
export const getUpdateFolder = (): ((id: string, opt: Partial<Folder>) => void) =>
	useFolderStore.getState().updateFolder;
