/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { faker } from '@faker-js/faker';
import { Folder, Folders, FolderView, Grant } from '@zextras/carbonio-shell-ui';
import { FOLDERS } from '../carbonio-shell-ui-constants';
import { getMocksContext, getRandomIdentity } from '../utils/mocks-context';

/**
 * Traverse the folder hierarchy and set (byref) the reference to folder's parent
 * @param folder
 * @param parent
 */
const fillReferenceToParent = (folder: Folder, parent?: Folder): void => {
	// eslint-disable-next-line no-param-reassign
	folder.parent = parent;
	folder.children.forEach((child) => {
		fillReferenceToParent(child, folder);
	});
};

/**
 * Generate a semi-fixed folders structure mock
 * TODO make it more flexible
 */
export const generateFolders = (): Folders => {
	const mockContext = getMocksContext();
	const rootUuid = faker.datatype.uuid();
	const inboxUuid = faker.datatype.uuid();
	let userFolderIdSequence = 100;
	const getNextFolderId = (zid?: string): string => {
		userFolderIdSequence += 1;
		if (zid) {
			return `${zid}:${userFolderIdSequence}`;
		}

		return `${userFolderIdSequence}`;
	};

	const calendarsRandomUser1 = getRandomIdentity(mockContext.viewFreeBusyIdentities);
	const calendarsRandomUser2 = getRandomIdentity(mockContext.viewFreeBusyIdentities);

	const contactsRandomUser1 = getRandomIdentity(mockContext.otherUsersIdentities);
	const contactsRandomUser2 = getRandomIdentity(mockContext.otherUsersIdentities);

	const result = {
		[FOLDERS.USER_ROOT]: {
			id: FOLDERS.USER_ROOT,
			uuid: rootUuid,
			name: 'USER_ROOT',
			absFolderPath: '/',
			l: '11',
			luuid: '808e2306-ba25-42f8-9aac-67b3762db30c',
			checked: false,
			rev: 1,
			ms: 1,
			n: 0,
			s: 0,
			i4ms: 399,
			i4next: 300,
			activesyncdisabled: false,
			webOfflineSyncDays: 0,
			recursive: false,
			deletable: false,
			isLink: false,
			children: [
				{
					id: getNextFolderId(),
					uuid: faker.datatype.uuid(),
					name: 'blacklisted',
					absFolderPath: '/blacklisted',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					f: 'i',
					view: 'contact' as FolderView,
					rev: 1378,
					ms: 12599,
					n: 0,
					s: 0,
					i4ms: 1378,
					i4next: 684,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: true,
					acl: {
						grant: [
							{
								zid: getRandomIdentity(mockContext.otherUsersIdentities)?.id ?? '',
								gt: 'usr' as Grant['gt'],
								perm: 'r'
							}
						]
					},
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.BRIEFCASE,
					uuid: faker.datatype.uuid(),
					name: 'Briefcase',
					absFolderPath: '/Briefcase',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'document' as FolderView,
					rev: 1,
					ms: 1,
					n: 1,
					s: 12492,
					i4ms: 18659,
					i4next: 8949,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.CALENDAR,
					uuid: faker.datatype.uuid(),
					name: 'Calendar',
					absFolderPath: '/Calendar',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: true,
					f: 'b#i',
					color: '6',
					view: 'appointment' as FolderView,
					rev: 1,
					ms: 33272,
					n: 159,
					s: 0,
					i4ms: 33640,
					i4next: 17193,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					acl: {
						grant: [
							{
								zid: getRandomIdentity(mockContext.otherUsersIdentities)?.id ?? '',
								gt: 'usr' as Grant['gt'],
								perm: 'r'
							},
							{
								zid: getRandomIdentity(mockContext.otherUsersIdentities)?.id ?? '',
								gt: 'usr' as Grant['gt'],
								perm: 'r'
							}
						]
					},
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.CONTACTS,
					uuid: faker.datatype.uuid(),
					name: 'Contacts',
					absFolderPath: '/Contacts',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'contact' as FolderView,
					rev: 1,
					ms: 1,
					n: 6,
					s: 0,
					i4ms: 30800,
					i4next: 3281,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.DRAFTS,
					uuid: faker.datatype.uuid(),
					name: 'Drafts',
					absFolderPath: '/Drafts',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'message' as FolderView,
					rev: 1,
					ms: 1,
					n: 13,
					s: 19366,
					i4ms: 33653,
					i4next: 17212,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.AUTO_CONTACTS,
					uuid: faker.datatype.uuid(),
					name: 'Emailed Contacts',
					absFolderPath: '/Emailed Contacts',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'contact' as FolderView,
					rev: 1,
					ms: 2455,
					n: 20,
					s: 0,
					i4ms: 20920,
					i4next: 10419,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.INBOX,
					uuid: inboxUuid,
					name: 'Inbox',
					absFolderPath: '/Inbox',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					f: 'ui',
					u: 37,
					view: 'message' as FolderView,
					rev: 1,
					ms: 2633,
					n: 889,
					s: 174031840,
					i4ms: 33663,
					i4next: 17222,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					acl: {
						grant: []
					},
					isLink: false,
					children: [
						{
							id: getNextFolderId(),
							uuid: faker.datatype.uuid(),
							name: 'Confluence',
							absFolderPath: '/Inbox/Confluence',
							l: FOLDERS.INBOX,
							luuid: inboxUuid,
							checked: false,
							f: 'u',
							u: 25,
							view: 'message' as FolderView,
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
						},
						{
							id: getNextFolderId(),
							uuid: faker.datatype.uuid(),
							name: 'GitHub',
							absFolderPath: '/Inbox/GitHub',
							l: FOLDERS.INBOX,
							luuid: inboxUuid,
							checked: false,
							view: 'message' as FolderView,
							rev: 3217,
							ms: 3217,
							n: 251,
							s: 1754530,
							i4ms: 28153,
							i4next: 4034,
							activesyncdisabled: false,
							webOfflineSyncDays: 0,
							recursive: false,
							deletable: true,
							isLink: false,
							children: [],
							parent: undefined,
							depth: 2
						},
						{
							id: getNextFolderId(),
							uuid: faker.datatype.uuid(),
							name: 'HR',
							absFolderPath: '/Inbox/HR',
							l: FOLDERS.INBOX,
							luuid: inboxUuid,
							checked: false,
							view: 'message' as FolderView,
							rev: 18622,
							ms: 18622,
							n: 93,
							s: 35627011,
							i4ms: 33528,
							i4next: 17161,
							activesyncdisabled: false,
							webOfflineSyncDays: 0,
							recursive: false,
							deletable: true,
							isLink: false,
							children: [],
							parent: undefined,
							depth: 2
						},
						{
							id: getNextFolderId(),
							uuid: faker.datatype.uuid(),
							name: 'Jenkins',
							absFolderPath: '/Inbox/Jenkins',
							l: FOLDERS.INBOX,
							luuid: inboxUuid,
							checked: false,
							f: 'u',
							u: 9,
							view: 'message' as FolderView,
							rev: 2863,
							ms: 10162,
							n: 9,
							s: 291992,
							i4ms: 33660,
							i4next: 17220,
							activesyncdisabled: false,
							webOfflineSyncDays: 0,
							recursive: false,
							deletable: true,
							isLink: false,
							children: [],
							parent: undefined,
							depth: 2
						},
						{
							id: getNextFolderId(),
							uuid: faker.datatype.uuid(),
							name: 'terzo livello',
							absFolderPath: '/Inbox/terzo livello',
							l: FOLDERS.INBOX,
							luuid: inboxUuid,
							checked: false,
							f: 'i',
							view: 'message' as FolderView,
							rev: 11453,
							ms: 22118,
							n: 0,
							s: 0,
							i4ms: 14123,
							i4next: 6508,
							activesyncdisabled: false,
							webOfflineSyncDays: 0,
							recursive: false,
							deletable: true,
							acl: {
								grant: [
									{
										zid: getRandomIdentity(mockContext.otherUsersIdentities)?.id ?? '',
										gt: 'usr' as Grant['gt'],
										perm: 'r'
									},
									{
										zid: getRandomIdentity(mockContext.otherUsersIdentities)?.id ?? '',
										gt: 'usr' as Grant['gt'],
										perm: 'r'
									}
								]
							},
							isLink: false,
							children: [],
							parent: undefined,
							depth: 2
						}
					],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.SPAM,
					uuid: faker.datatype.uuid(),
					name: 'Junk',
					absFolderPath: '/Junk',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'message' as FolderView,
					rev: 1,
					ms: 1,
					n: 1,
					s: 10815,
					i4ms: 33396,
					i4next: 17084,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.SENT,
					uuid: faker.datatype.uuid(),
					name: 'Sent',
					absFolderPath: '/Sent',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'message' as FolderView,
					rev: 1,
					ms: 1,
					n: 313,
					s: 61983538,
					i4ms: 33637,
					i4next: 17208,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: FOLDERS.TRASH,
					uuid: faker.datatype.uuid(),
					name: 'Trash',
					absFolderPath: '/Trash',
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					rev: 1,
					ms: 28502,
					n: 16,
					s: 319017,
					i4ms: 33653,
					i4next: 17212,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: getNextFolderId(),
					uuid: faker.datatype.uuid(),
					name: `${calendarsRandomUser1?.fullName}'s Calendar`,
					absFolderPath: `/${calendarsRandomUser1?.fullName}'s Calendar`,
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'appointment' as FolderView,
					rev: 25949,
					ms: 25953,
					n: 7353,
					s: 28604595,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'r',
					recursive: false,
					rest: `https://${faker.internet.domainName()}/home/${
						calendarsRandomUser1?.email
					}/Calendar`,
					deletable: true,
					owner: calendarsRandomUser1?.email,
					zid: calendarsRandomUser1?.id,
					rid: FOLDERS.CALENDAR,
					ruuid: faker.datatype.uuid(),
					oname: 'Calendar',
					reminder: false,
					broken: false,
					isLink: true,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: getNextFolderId(),
					uuid: faker.datatype.uuid(),
					name: `${calendarsRandomUser2?.fullName}'s Calendar`,
					absFolderPath: `/${calendarsRandomUser2?.fullName}'s Calendar`,
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'appointment' as FolderView,
					rev: 24909,
					ms: 25962,
					n: 2177,
					s: 82709085,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'r',
					recursive: false,
					rest: `https://${faker.internet.domainName()}/home/${
						calendarsRandomUser2?.email
					}/Calendar`,
					deletable: true,
					owner: calendarsRandomUser2?.email,
					zid: calendarsRandomUser2?.id,
					rid: FOLDERS.CALENDAR,
					ruuid: faker.datatype.uuid(),
					oname: 'Calendar',
					reminder: false,
					broken: false,
					isLink: true,
					children: [],
					parent: undefined,
					depth: 1
				},
				{
					id: getNextFolderId(),
					uuid: faker.datatype.uuid(),
					name: `${contactsRandomUser1?.fullName}'s Contacts`,
					absFolderPath: `/${contactsRandomUser1?.fullName}'s Contacts`,
					l: FOLDERS.USER_ROOT,
					luuid: rootUuid,
					checked: false,
					view: 'contact' as FolderView,
					rev: 7038,
					ms: 7038,
					n: 0,
					s: 0,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'rwidxc',
					recursive: false,
					rest: `https://${faker.internet.domainName()}/home/${
						contactsRandomUser1?.email
					}/Contacts`,
					deletable: true,
					owner: contactsRandomUser1?.email,
					zid: contactsRandomUser1?.id,
					rid: FOLDERS.CONTACTS,
					ruuid: 'b86d7fbf-c9ef-42a0-96a2-72fc7bc9879b',
					oname: 'Contacts',
					reminder: false,
					broken: false,
					isLink: true,
					children: [],
					parent: undefined,
					depth: 1
				}
			],
			parent: undefined,
			depth: 0
		}
	} as Folders;

	// Append the user_root children to the result
	result[FOLDERS.USER_ROOT].children.forEach((child) => {
		result[child.id] = child;
	});

	fillReferenceToParent(result[FOLDERS.USER_ROOT], undefined);

	return result;
};
