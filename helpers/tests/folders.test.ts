/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getUserAccount } from '@zextras/carbonio-shell-ui';
import { values } from 'lodash';

import {
	getFolderIdParts,
	getFolderOwnerAccountName,
	isAdministerAllowed,
	isCreateAllowed,
	isDeleteAllowed,
	isInsertAllowed,
	isReadAllowed,
	isRoot,
	isSystemFolder,
	isTrash,
	isTrashed,
	isWriteAllowed
} from '../folders';
import { useFolderStore } from '../../store/zustand/folder';
import { getRootsMap } from '../../store/zustand/folder/hooks';
import { FOLDERS_DESCRIPTORS } from '../../test/constants';
import { FOLDERS } from '../../test/mocks/carbonio-shell-ui-constants';
import { generateFolder } from '../../test/mocks/folders/folders-generator';
import { populateFoldersStore } from '../../test/mocks/store/folders';
import { getMocksContext } from '../../test/mocks/utils/mocks-context';

describe('Folder id', () => {
	test('with zid', () => {
		const parts = getFolderIdParts('a79fa996-e90e-4f04-97c4-c84209bb8277:1087');
		expect(parts.zid).toBe('a79fa996-e90e-4f04-97c4-c84209bb8277');
		expect(parts.id).toBe('1087');
	});

	test('without zid', () => {
		const parts = getFolderIdParts('1087');
		expect(parts.zid).toBeNull();
		expect(parts.id).toBe('1087');
	});

	test('without id', () => {
		const parts = getFolderIdParts('a79fa996-e90e-4f04-97c4-c84209bb8277:');
		expect(parts.zid).toBeNull();
		expect(parts.id).toBeNull();
	});

	test('with zid only', () => {
		const parts = getFolderIdParts('a79fa996-e90e-4f04-97c4-c84209bb8277');
		expect(parts.zid).toBeNull();
		expect(parts.id).toBeNull();
	});
});

describe('Folder owner', () => {
	const mocksContext = getMocksContext();
	const primaryAccount = getUserAccount();

	test('For a folder with an id without the zid, the primary account name is returned', () => {
		populateFoldersStore();
		const roots = getRootsMap();
		const folderId = FOLDERS.INBOX;
		const ownerAccountName = getFolderOwnerAccountName(folderId, roots);
		expect(ownerAccountName).toBe(primaryAccount?.name ?? 'No account');
	});

	test("For a folder with an id containing the zid, the name of the shared account owning that folder's root is returned", () => {
		populateFoldersStore();
		const roots = getRootsMap();
		const sharedAccount = mocksContext.identities.sendAs[0];
		const folderId = `${sharedAccount.identity.id}:${FOLDERS.INBOX}`;
		const ownerAccountName = getFolderOwnerAccountName(folderId, roots);
		expect(ownerAccountName).toBe(sharedAccount.identity.email);
	});

	test('For a folder with an id containing an unknown zid, the primary account name is returned', () => {
		populateFoldersStore();
		const roots = getRootsMap();
		const folderId = `TheAnswerIs42:${FOLDERS.INBOX}`;
		const ownerAccountName = getFolderOwnerAccountName(folderId, roots);
		expect(ownerAccountName).toBe(primaryAccount?.name ?? 'No account');
	});
});

describe('isRoot', () => {
	test('If no folderId is specified false is returned', () => {
		const folderId = undefined;
		expect(
			isRoot(
				// Testing the case in which the parameter is undefined
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				folderId
			)
		).toBe(false);
	});

	test('A folder with a id = 1 is recognized as a root', () => {
		const folderId = '1';
		expect(isRoot(folderId)).toBe(true);
	});

	test('A folder with a id != 1 is not recognized as a root', () => {
		const folderId = '99';
		expect(isRoot(folderId)).toBe(false);
	});

	test('A folder with a zid and an id = 1 is recognized as a root', () => {
		const folderId = 'somelonghash:1';
		expect(isRoot(folderId)).toBe(true);
	});

	test('A folder with a zid and an id != 1 is not recognized as a root', () => {
		const folderId = 'anotherlonghash:99';
		expect(isRoot(folderId)).toBe(false);
	});
});

describe('isSystemFolder', () => {
	test.each`
		folder                              | result
		${FOLDERS_DESCRIPTORS.userRoot}     | ${true}
		${FOLDERS_DESCRIPTORS.inbox}        | ${true}
		${FOLDERS_DESCRIPTORS.sent}         | ${true}
		${FOLDERS_DESCRIPTORS.trash}        | ${true}
		${FOLDERS_DESCRIPTORS.spam}         | ${true}
		${FOLDERS_DESCRIPTORS.draft}        | ${true}
		${FOLDERS_DESCRIPTORS.contacts}     | ${true}
		${FOLDERS_DESCRIPTORS.autoContacts} | ${true}
		${FOLDERS_DESCRIPTORS.calendar}     | ${true}
		${FOLDERS_DESCRIPTORS.userDefined}  | ${false}
	`(`returns $result if $folder.desc folder id is passed as parameter`, ({ folder, result }) => {
		expect(isSystemFolder(folder.id)).toEqual(result);
	});
});

describe('isTrash', () => {
	test('If no folderId is specified false is returned', () => {
		const folderId = undefined;
		expect(
			isTrash(
				// Testing the case in which the parameter is undefined
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				folderId
			)
		).toBe(false);
	});

	test('A folder with a id = 6 is recognized as a trash', () => {
		const folderId = FOLDERS.TRASH;
		expect(isTrash(folderId)).toBe(true);
	});

	test('A folder with a id != 6 is not recognized as a trash', () => {
		const folderId = '99';
		expect(isTrash(folderId)).toBe(false);
	});

	test('A folder with a zid and an id = 6 is recognized as a trash', () => {
		const folderId = `somelonghash:${FOLDERS.TRASH}`;
		expect(isTrash(folderId)).toBe(true);
	});

	test('A folder with a zid and an id != 6 is not recognized as a trash', () => {
		const folderId = 'anotherlonghash:99';
		expect(isTrash(folderId)).toBe(false);
	});
});

describe('isTrashed', () => {
	test('A folder inside the trash (passed by ref) is recognized as trashed', () => {
		populateFoldersStore();
		const folders = values(useFolderStore.getState().folders);
		const trashFolder = folders.find((folder) => isTrash(folder.id));
		if (!trashFolder || !trashFolder.children.length) {
			return;
		}

		expect(isTrashed({ folder: trashFolder.children[0] })).toBe(true);
	});

	test('A folder inside the trash (passed by id) is recognized as trashed', () => {
		populateFoldersStore();
		const folders = values(useFolderStore.getState().folders);
		const trashFolder = folders.find((folder) => isTrash(folder.id));
		if (!trashFolder || !trashFolder.children.length) {
			return;
		}

		expect(isTrashed({ folderId: trashFolder.children[0].id })).toBe(true);
	});

	test('The inbox folder (passed by ref) is not recognized as trashed', () => {
		populateFoldersStore();
		const folders = values(useFolderStore.getState().folders);
		const folder = folders.find((folder) => folder.id === FOLDERS.INBOX);
		if (!folder) {
			return;
		}
		expect(isTrashed({ folder })).toBe(false);
	});

	test('The inbox folder (passed by id) is not recognized as trashed', () => {
		populateFoldersStore();
		expect(isTrashed({ folderId: FOLDERS.INBOX })).toBe(false);
	});
});

describe('isReadAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isReadAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'r' perm", () => {
		const folder = generateFolder({ perm: 'rwc' });
		expect(isReadAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'r' perm", () => {
		const folder = generateFolder({ perm: 'wc' });
		expect(isReadAllowed(folder)).toBeFalsy();
	});
});

describe('isWriteAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isWriteAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'w' perm", () => {
		const folder = generateFolder({ perm: 'rwc' });
		expect(isWriteAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'w' perm", () => {
		const folder = generateFolder({ perm: 'r' });
		expect(isWriteAllowed(folder)).toBeFalsy();
	});
});

describe('isCreateAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isCreateAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'c' perm", () => {
		const folder = generateFolder({ perm: 'rwc' });
		expect(isCreateAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'c' perm", () => {
		const folder = generateFolder({ perm: 'wr' });
		expect(isCreateAllowed(folder)).toBeFalsy();
	});
});

describe('isInsertAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isInsertAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'i' perm", () => {
		const folder = generateFolder({ perm: 'riwc' });
		expect(isInsertAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'i' perm", () => {
		const folder = generateFolder({ perm: 'xrwc' });
		expect(isInsertAllowed(folder)).toBeFalsy();
	});
});

describe('isDeleteAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isDeleteAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'd' perm", () => {
		const folder = generateFolder({ perm: 'rid' });
		expect(isDeleteAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'd' perm", () => {
		const folder = generateFolder({ perm: 'xrwc' });
		expect(isDeleteAllowed(folder)).toBeFalsy();
	});
});

describe('isAdministerAllowed', () => {
	it('should return true if the folder has no permissions set', () => {
		const folder = generateFolder();
		folder.perm = undefined;
		expect(isAdministerAllowed(folder)).toBeTruthy();
	});

	it("should return true if the folder has the 'a' perm", () => {
		const folder = generateFolder({ perm: 'rad' });
		expect(isAdministerAllowed(folder)).toBeTruthy();
	});

	it("should return false if the parameter without the 'a' perm", () => {
		const folder = generateFolder({ perm: 'xrwc' });
		expect(isAdministerAllowed(folder)).toBeFalsy();
	});
});
