import { FolderActionsType } from '../constants/folders';
import { Folder } from '../types/folder';

/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const isValidFolderName = (folderName: string): boolean => {
	// Check if the folder name is empty
	if (!folderName.trim()) {
		return false;
	}

	// Regular expression pattern for invalid characters
	const invalidChars = /["/:]/;

	// Check if the folder name contains any invalid characters
	if (invalidChars.test(folderName)) {
		return false;
	}

	// Check if the folder name is too long (limit it to 128 characters)
	if (folderName.length > 128) {
		return false;
	}

	// If all checks pass, the folder name is considered valid
	return true;
};

export const allowedActionOnSharedAccount = (folder: Folder, action: string): boolean => {
	const permission = folder.perm;
	switch (action) {
		case FolderActionsType.NEW:
			if (permission)
				if (permission.includes('rwidx')) {
					return true;
				} else {
					return false;
				}
			return true;
		case FolderActionsType.SHARE:
			if (permission)
				if (permission.includes('rwidxa')) {
					return true;
				} else {
					return false;
				}
			return true;
		default:
			return true;
	}
};
