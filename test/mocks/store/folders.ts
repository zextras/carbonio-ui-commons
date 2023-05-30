/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useFolderStore } from '../../../store/zustand/folder';
import { FolderView } from '../../../types/folder';
import { generateFolders } from '../folders/folders-generator';

/**
 * Initialize the folder's store with roots and folders provided by
 * the mocks generators
 */
export const populateFoldersStore = (view?: FolderView): void => {
	const initialStoreState = {
		folders: generateFolders(view),
		searches: {}
	};
	useFolderStore.setState(initialStoreState, true);
};
