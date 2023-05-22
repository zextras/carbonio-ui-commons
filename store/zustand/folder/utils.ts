/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FOLDERS, ROOT_NAME } from '@zextras/carbonio-shell-ui';
import { sortBy } from 'lodash';
import { Folders } from '../../../types/folder';
import type { Folder, FolderView, LinkFolder, TreeNode } from '../../../types/folder';

const hasId = (f: Folder | TreeNode<unknown>, id: string): boolean => f.id.split(':').includes(id);
const getOriginalId = (f: Folder): string => {
	const parts = f.id.split(':');
	return parts[1] ?? parts[0];
};
export const sortFolders = (f: Folder): string => {
	const id = getOriginalId(f);
	if (id === FOLDERS.TRASH) {
		return FOLDERS.LAST_SYSTEM_FOLDER_POSITION;
	}
	return parseInt(id, 10) < 17 ? `   ${id}` : f.name.toLowerCase();
};

export const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.USER_ROOT || (f as LinkFolder).oname === ROOT_NAME;

export const isTrash = (f: Folder): boolean => hasId(f, FOLDERS.TRASH);

export const isNestedInTrash = (item: Folder): boolean =>
	!!item?.absFolderPath?.includes(`/${FOLDERS.TRASH}/`);

export const isTrashOrNestedInIt = (item: Folder): boolean =>
	isTrash(item) || isNestedInTrash(item);

export const folderViewFilter =
	(v: FolderView) =>
	(deep?: boolean) =>
	(f: Folder): boolean =>
		f.view === v || !deep || (typeof f.view === 'undefined' && !isRoot(f));

export const filterNodes = <T>(
	children: TreeNode<T>[],
	f: (deep?: boolean) => (i: TreeNode<T>) => boolean,
	sortFunction?: (i: TreeNode<T>) => number | string,
	deep?: boolean
): TreeNode<T>[] => {
	const childrenSorted = sortFunction ? sortBy(children, sortFunction) : children;
	return childrenSorted
		.filter(f(deep))
		.map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f, sortFunction, true) }));
};

type MapNodesOptions<T, U> = {
	mapFunction: (i: TreeNode<T>) => U;
	filterFunction: (deep?: boolean) => (i: TreeNode<T>) => boolean;
	recursionKey: keyof U;
	sortFunction: (i: TreeNode<T>) => number | string;
	deep: boolean;
};
export const mapNodes = <T, U>(
	children: TreeNode<T>[],
	{ mapFunction, filterFunction, recursionKey, sortFunction, deep }: MapNodesOptions<T, U>
): U[] =>
	sortBy(children, sortFunction).reduce((acc, folder) => {
		if (filterFunction(deep)(folder)) {
			acc.push({
				...mapFunction(folder),
				[recursionKey]: mapNodes<TreeNode<T>, U>(folder.children, {
					mapFunction,
					filterFunction,
					recursionKey,
					sortFunction,
					deep: true
				})
			});
		}
		return acc;
	}, [] as U[]);

/**
 * Recursive function that returns a flat map of the children folders
 * @param children
 */
export const getFlatChildrenFolders = (children: Array<Folder>): Folders => {
	let destination: Folders = {};
	children.forEach((child) => {
		destination[child.id] = child;
		if (child.children) {
			destination = { ...destination, ...getFlatChildrenFolders(child.children) };
		}
	});

	return destination;
};
