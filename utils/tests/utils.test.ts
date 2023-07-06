/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { faker } from '@faker-js/faker';
import { allowedActionOnSharedAccount, isValidFolderName } from '../utils';
import { FOLDERS } from '../../test/mocks/carbonio-shell-ui-constants';
import { Folder } from '../../types/folder';

const generateWordsWithLength = (length: number): string => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let result = '';
	for (let i = 0; i < length; i += 1) {
		const randomIndex = Math.floor(Math.random() * alphabet.length);
		const randomChar = alphabet[randomIndex];
		result += randomChar;
	}
	return result;
};

describe('Folder name validation', () => {
	test('valid folder name', () => {
		const folderName = faker.lorem.word();
		expect(isValidFolderName(folderName)).toBe(true);
	});

	test('folder name with special characters', () => {
		const folderName = `${faker.lorem.word()}/:`;
		expect(isValidFolderName(folderName)).toBe(false);
	});

	test('folder name with length less than 128', () => {
		const folderName = generateWordsWithLength(50);
		expect(isValidFolderName(folderName)).toBe(true);
	});

	test('folder name with length more than 128', () => {
		const folderName = generateWordsWithLength(130);
		expect(isValidFolderName(folderName)).toBe(false);
	});
});

describe(`Shared account's folder has access for actions`, () => {
	test(`should return true for 'NEW' action with "rwidx"(Manager) permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'rwidx'
		};
		const action = 'new';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(true);
	});

	test(`should return true for 'NEW' action without permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2
		};
		const action = 'new';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(true);
	});

	test(`should return false for 'NEW' action with "r" permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'r'
		};
		const action = 'new';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(false);
	});

	test(`should return true for 'NEW' action with "rwidxa"(Admin) permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'rwidxa'
		};
		const action = 'new';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(true);
	});

	test(`should return true for 'SHARE' action with "rwidxa"(Admin) permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'rwidxa'
		};
		const action = 'share';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(true);
	});

	test(`should return true for 'SHARE' action without permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2
		};
		const action = 'share';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(true);
	});

	test(`should return false for 'SHARE' action with "r" permission`, () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'r'
		};
		const action = 'share';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(false);
	});
	test('should return false for NEW action with "rwidx"(Manager) permission', () => {
		const folder: Folder = {
			id: '106',
			uuid: faker.datatype.uuid(),
			name: 'Confluence',
			absFolderPath: '/Inbox/Confluence',
			l: FOLDERS.INBOX,
			luuid: faker.datatype.uuid(),
			checked: false,
			f: 'u',
			u: 25,
			view: 'message',
			rev: 27896,
			ms: 27896,
			n: 37,
			s: 5550022,
			i4ms: 33607,
			i4next: 17183,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: true,
			isLink: false,
			children: [],
			parent: undefined,
			depth: 2,
			perm: 'rwidx'
		};
		const action = 'share';
		const result = allowedActionOnSharedAccount(folder, action);
		expect(result).toBe(false);
	});
});
