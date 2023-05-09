/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useFolderStore } from '../../../store/zustand/folder';
import { generateFolders } from '../folders/folders-generator';
import { generateRoots } from '../folders/roots-generator';

/**
 * Initialize the folder's store with roots and folders provided by
 * the mocks generators
 */
export const populateFoldersStore = (): void => {
	const initialStoreState = {
		roots: generateRoots(),
		folders: generateFolders(),
		searches: {}
	};
	useFolderStore.setState(initialStoreState, true);
};
