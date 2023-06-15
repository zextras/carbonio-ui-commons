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
