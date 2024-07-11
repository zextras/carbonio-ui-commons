/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getUserAccount } from '@zextras/carbonio-shell-ui';
import { find } from 'lodash';
import { FOLDERS } from '../constants/folders';

import { useFolderStore } from '../store/zustand/folder';
import type { Folder, Folders } from '../types/folder';

const NO_ACCOUNT_NAME = 'No account';

/*
 * Describe the folder id syntax
 *
 * [<zid>:]<folderId>
 *
 * e.g. a79fa996-e90e-4f04-97c4-c84209bb8277:2
 */
const FOLDERID_REGEX = /^([^:]+(?=:))*:?(\d+)$/;

type FolderIdType = { zid: string | null; id: string | null };

/**
 * Parse the given folder id and returns on object with the composing parts of the folder id
 * @param folderId
 */
export const getFolderIdParts = (folderId: string): FolderIdType => {
	const result: FolderIdType = { zid: null, id: null };

	if (!folderId || !folderId.match(FOLDERID_REGEX)) {
		return result;
	}

	const parts = FOLDERID_REGEX.exec(folderId);
	if (!parts) {
		return result;
	}

	[, result.zid = null, result.id = null] = parts;
	return result;
};

/**
 * Get the account name of the owner of the given folder, if the owner is an
 * "other" account, different from the primary account of the current user.
 * If the owner is the primary account then <code>null</code> is returned
 * @param folderId
 * @param folderRoots
 */
export const getFolderOtherOwnerAccountName = (
	folderId: string,
	folderRoots: Folders
): string | null => {
	if (!folderId) {
		return null;
	}

	const { zid } = getFolderIdParts(folderId);
	if (!zid) {
		return null;
	}

	/** find the folderRoots for which the id corresponds to the message zid
	 * if the folderRoots has an owner, return the owner
	 * if not, return null
	 * */

	const matchingFolderRoot = find(folderRoots, (c) => c.id.includes(zid));
	if (!matchingFolderRoot) {
		return null;
	}

	return 'owner' in matchingFolderRoot && matchingFolderRoot.owner
		? matchingFolderRoot.owner
		: null;
};

/**
 * Returns the account name of the owner of the folder, based on the folder id
 * @param folderId
 * @param folderRoots
 */
export const getFolderOwnerAccountName = (folderId: string, folderRoots: Folders): string => {
	const primaryAccount = getUserAccount();

	/*
	 * Try to get the account of the "other" owner, aka an owner which
	 * is not the primary account of the current user
	 */
	const otherOwnerAccount = getFolderOtherOwnerAccountName(folderId, folderRoots);

	if (!otherOwnerAccount) {
		return primaryAccount?.name ?? NO_ACCOUNT_NAME;
	}

	return otherOwnerAccount;
};

/**
 * Tells if a folder with the given id is a spam folder
 * @param folderId
 * @param folderType
 */
export const isA = (folderId: string, folderType: keyof Folders): boolean => {
	if (!folderId) {
		return false;
	}
	return getFolderIdParts(folderId).id === folderType;
};

/**
 * Tells if a folder with the given id is the default account root folder
 * @param folderId
 */
export const isDefaultAccountRoot = (folderId: string): boolean => folderId === FOLDERS.USER_ROOT;

/**
 * Tells if a folder with the given id is a root folder
 * @param folderId
 */
export const isRoot = (folderId: string): boolean => isA(folderId, FOLDERS.USER_ROOT);

/**
 * Tells if the given folder is a link to a folder shared by another user
 * @param folder
 */
export const isLink = (folder: Folder): boolean =>
	(folder && folder.isLink && getFolderIdParts(folder.id).zid === null) ?? false;

/**
 * Tells if a folder is a folder of a shared account
 * @param folderId
 */
export function isSharedAccountFolder(folderId: string): boolean {
	return getFolderIdParts(folderId).zid !== null;
}

/**
 * Tells if a folder is a system one
 * @param folderId
 */
export const isSystemFolder = (folderId: string): boolean => {
	const { id } = getFolderIdParts(folderId);
	if (!id) {
		return false;
	}
	const systemFoldersIds: readonly string[] = Object.values(FOLDERS);
	return systemFoldersIds.includes(folderId);
};

/**
 * Tells if a folder is a trashed folder
 * @param folder
 * @param folderId
 */
export const isTrashed = ({
	folder,
	folderId
}: {
	folder?: Folder;
	folderId?: string;
}): boolean => {
	if (!folder && !folderId) {
		return false;
	}
	const folderIdAbsPath = useFolderStore.getState()?.folders?.[folderId ?? '']?.absFolderPath;

	const path = folder ? folder.absFolderPath : folderIdAbsPath;
	if (!path) {
		return false;
	}

	return path.toLowerCase().startsWith('/trash');
};

/**
 * Tells if a folder with the given id is a trash folder
 * @param folderId
 */
export const isTrash = (folderId: string): boolean => isA(folderId, FOLDERS.TRASH);

/**
 * Tells if the current user has read permission on the given folder/link
 * @param folder
 */
export const isReadAllowed = (folder: Folder): boolean => !folder.perm || folder.perm.includes('r');

/**
 * Tells if the current user has write permission on the given folder/link
 * @param folder
 */
export const isWriteAllowed = (folder: Folder): boolean =>
	!folder.perm || folder.perm.includes('w');

/**
 * Tells if the current user has insertion permission on the given folder/link
 * @param folder
 */
export const isInsertAllowed = (folder: Folder): boolean =>
	!folder.perm || folder.perm.includes('i');

/**
 * Tells if the current user has subfolder creation permission on the given folder/link
 * @param folder
 */
export const isCreateAllowed = (folder: Folder): boolean =>
	!folder.perm || folder.perm.includes('c');

/**
 * Tells if the current user has deletion permission on the given folder/link
 * @param folder
 */
export const isDeleteAllowed = (folder: Folder): boolean =>
	!folder.perm || folder.perm.includes('d');

/**
 * Tells if the current user has administration permission on the given folder/link
 * @param folder
 */
export const isAdministerAllowed = (folder: Folder): boolean =>
	!folder.perm || folder.perm.includes('a');
('');
