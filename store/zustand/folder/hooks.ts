/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FOLDERS } from '@zextras/carbonio-shell-ui';
import { filter, find, keyBy, values } from 'lodash';
import { ComponentType, useMemo } from 'react';
import type {
	AccordionFolder,
	Folder,
	FolderView,
	Folders,
	SearchFolder,
	Searches
} from '../../../types/folder';

import { useFolderStore } from './store';
import { folderViewFilter, isRoot, mapNodes, sortFolders } from './utils';

// FOLDERS
export const useFolder = (id: string): Folder | undefined => useFolderStore((s) => s.folders?.[id]);
export const getFolder = (id: string): Folder | undefined =>
	useFolderStore.getState()?.folders?.[id];
export const useFoldersMap = (): Folders => useFolderStore((s) => s.folders);
export const useFoldersArray = (): Array<Folder> => useFolderStore((s) => values(s.folders));

export const getFoldersMap = (): Folders => useFolderStore.getState().folders;
export const getFoldersArray = (): Array<Folder> => values(useFolderStore.getState().folders);

// ROOTS
export const useRoot = (id: string): Folder | undefined => useFolderStore((s) => s.folders?.[id]);
export const getRoot = (id: string): Folder | undefined => useFolderStore.getState().folders?.[id];
export const useRootsArray = (): Array<Folder> =>
	useFolderStore((s) =>
		filter(
			s.folders,
			(f) => f.id === FOLDERS.USER_ROOT || f.id?.split(':')?.[1] === FOLDERS.USER_ROOT
		)
	);
export const getRootsArray = (): Array<Folder> =>
	filter(
		useFolderStore.getState().folders,
		(f) => f.id === FOLDERS.USER_ROOT || f.id?.split(':')?.[1] === FOLDERS.USER_ROOT
	);
export const useRootsMap = (): Record<string, Folder> =>
	useFolderStore((s) =>
		keyBy(
			filter(
				s.folders,
				(f) => f.id === FOLDERS.USER_ROOT || f.id?.split(':')?.[1] === FOLDERS.USER_ROOT
			),
			'id'
		)
	);
export const getRootsMap = (): Record<string, Folder> =>
	keyBy(
		filter(
			useFolderStore.getState().folders,
			(f) => f.id === FOLDERS.USER_ROOT || f.id?.split(':')?.[1] === FOLDERS.USER_ROOT
		),
		'id'
	);

// ROOTS BY VIEW
export const useRootByUser = (
	userId: string
): Folder | SearchFolder | Record<string, never> | undefined =>
	useFolderStore((s) => find(s.folders, (f) => f.name === userId));
export const getRootByUser = (
	userId: string
): Folder | SearchFolder | Record<string, never> | undefined => {
	const { folders } = useFolderStore.getState();
	return find(folders, (f) => f.name === userId);
};

// SEARCHES
export const useSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore((s) => s.searches?.[id]);
export const getSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore.getState().searches[id];
export const useSearchFolders = (): Searches => useFolderStore((s) => s.searches);
export const getSearchFolders = (): Searches => useFolderStore.getState().searches;

/**
 * @deprecated
 */
export const useFoldersAccordionByView = (
	view: FolderView,
	CustomComponent: ComponentType<{ folder: Folder }>,
	itemProps?: (item: AccordionFolder) => Record<string, any>
): Array<AccordionFolder> => {
	const roots = useRootsArray();
	return useMemo(
		() =>
			roots
				? mapNodes<Folder, AccordionFolder>(Object.values(roots), {
						mapFunction: (f) => {
							const item = {
								id: f.id,
								label: f.name,
								CustomComponent,
								items: [],
								folder: f,
								disableHover: isRoot(f)
							};
							const props = itemProps?.(item) ?? {};
							return { ...item, ...props };
						},
						filterFunction: folderViewFilter(view),
						recursionKey: 'items',
						sortFunction: sortFolders,
						deep: false
				  })
				: [],
		[CustomComponent, itemProps, roots, view]
	);
};
