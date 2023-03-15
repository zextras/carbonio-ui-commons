/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { Folder, Grant, Roots } from '@zextras/carbonio-shell-ui';
import { times } from 'lodash';
import { FakeIdentity } from '../accounts/fakeAccounts';
import { FOLDERS } from '../carbonio-shell-ui';
import { getMocksContext, getRandomIdentity } from '../utils/mocks-context';

export const generateRoots = (): Roots => {
	const mocksContext = getMocksContext();
	const rootId = faker.datatype.uuid();
	let nonSystemFolderIdCounter = 100;

	const getNextNonSystemFolderId = (): string => {
		nonSystemFolderIdCounter += 1;
		return `${nonSystemFolderIdCounter}`;
	};

	/**
	 *
	 * @param identity
	 * @param type
	 * @param perm
	 */
	const generateGrant = (
		identity: FakeIdentity | undefined,
		type: Grant['gt'],
		perm: Grant['perm']
	): Grant | undefined => {
		if (!identity) {
			return undefined;
		}

		return {
			zid: identity.id,
			gt: type,
			perm
		};
	};

	/**
	 * Generate "count" Grant objects
	 * @param identities
	 * @param type
	 * @param perm
	 * @param count
	 */
	const generateGrants = (
		identities: Array<FakeIdentity>,
		type: Grant['gt'],
		perm: Grant['perm'],
		count?: number
	): Array<Grant> => {
		if (!identities || !identities.length) {
			return [];
		}
		const result: Array<Grant> = [];
		times(count === undefined || count > identities.length ? identities.length : count, (index) => {
			const grant = generateGrant(identities[index], type, perm);
			if (grant) {
				result.push(grant);
			}
		});

		return result;
	};

	const generateLinkedCalendars = (
		identities: Array<FakeIdentity>,
		count?: number
	): Array<Folder> => {
		if (!identities || !identities.length) {
			return [];
		}
		return times(
			count === undefined || count > identities.length ? identities.length : count,
			(index) => {
				const identity = identities[index];
				return {
					id: getNextNonSystemFolderId(),
					uuid: faker.datatype.uuid(),
					name: `${identity.fullName}'s Calendar`,
					absFolderPath: `/${identity.fullName}'s Calendar`,
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'appointment',
					rev: 25949,
					ms: 25953,
					n: 7312,
					s: 28490313,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'r',
					recursive: false,
					deletable: true,
					owner: identity.email,
					zid: identity.id,
					rid: '10',
					ruuid: faker.datatype.uuid(),
					oname: 'Calendar',
					reminder: false,
					broken: false,
					isLink: true,
					children: [],
					depth: 1
				};
			}
		);
	};

	const generateLinkedAddressBooks = (
		identities: Array<FakeIdentity>,
		count?: number
	): Array<Folder> => {
		if (!identities || !identities.length) {
			return [];
		}
		return times(
			count === undefined || count > identities.length ? identities.length : count,
			(index) => {
				const identity = identities[index];
				return {
					id: getNextNonSystemFolderId(),
					uuid: faker.datatype.uuid(),
					name: `${identity.email}'s contacts`,
					absFolderPath: `/${identity.email}'s contacts`,
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'contact',
					rev: 7038,
					ms: 7038,
					n: 0,
					s: 0,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'rwidxc',
					recursive: false,
					deletable: true,
					owner: identity.email,
					zid: identity.id,
					rid: '7',
					ruuid: faker.datatype.uuid(),
					oname: 'Contacts',
					reminder: false,
					broken: false,
					isLink: true,
					children: [],
					depth: 1
				};
			}
		);
	};

	/**
	 *
	 * @param identities
	 * @param count
	 */
	const generateSharedAccountsFolderStructure = (
		identities: Array<FakeIdentity>,
		count?: number
	): Array<Folder> => {
		if (!identities || !identities.length) {
			return [];
		}
		return times(
			count === undefined || count > identities.length ? identities.length : count,
			(index) => {
				const identity = identities[index];
				const sharedAccountRootId = faker.datatype.uuid();
				return {
					id: getNextNonSystemFolderId(),
					uuid: sharedAccountRootId,
					name: identity.email,
					absFolderPath: `/${identity.email}`,
					l: '1',
					luuid: rootId,
					checked: false,
					f: '*',
					rev: 7036,
					ms: 7037,
					n: 0,
					s: 0,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					perm: 'rwidxc',
					recursive: false,
					deletable: true,
					owner: identity.email,
					zid: identity.id,
					rid: '1',
					ruuid: faker.datatype.uuid(),
					oname: 'USER_ROOT',
					reminder: false,
					broken: false,
					isLink: true,
					children: [
						// {
						// 	id: 'a79fa996-e90e-4f04-97c4-c84209bb8277:16',
						// 	uuid: '2b8938e4-bb5d-4f68-8fde-392eb4992e4e',
						// 	name: 'Briefcase',
						// 	absFolderPath: '/Briefcase',
						// 	l: 'a79fa996-e90e-4f04-97c4-c84209bb8277:1',
						// 	luuid: '1127af1b-7a31-4554-a693-1ef0b83b47ac',
						// 	checked: false,
						// 	view: 'document',
						// 	rev: 1,
						// 	ms: 1,
						// 	n: 0,
						// 	s: 0,
						// 	i4ms: 1,
						// 	i4next: 17,
						// 	activesyncdisabled: false,
						// 	webOfflineSyncDays: 0,
						// 	perm: 'rwidxc',
						// 	recursive: false,
						// 	deletable: false,
						// 	isLink: false,
						// 	children: [],
						// 	depth: 2
						// },
						// {
						// 	id: 'a79fa996-e90e-4f04-97c4-c84209bb8277:7',
						// 	uuid: 'b86d7fbf-c9ef-42a0-96a2-72fc7bc9879b',
						// 	name: 'Contacts',
						// 	absFolderPath: '/Contacts',
						// 	l: 'a79fa996-e90e-4f04-97c4-c84209bb8277:1',
						// 	luuid: '1127af1b-7a31-4554-a693-1ef0b83b47ac',
						// 	checked: false,
						// 	view: 'contact',
						// 	rev: 1,
						// 	ms: 1,
						// 	n: 0,
						// 	s: 0,
						// 	i4ms: 1,
						// 	i4next: 8,
						// 	activesyncdisabled: false,
						// 	webOfflineSyncDays: 0,
						// 	perm: 'rwidxc',
						// 	recursive: false,
						// 	deletable: false,
						// 	isLink: false,
						// 	children: [],
						// 	depth: 2
						// },
						// {
						// 	id: 'a79fa996-e90e-4f04-97c4-c84209bb8277:315',
						// 	uuid: 'fc7556b2-42f7-4e98-a1c4-af5ce149628a',
						// 	name: 'Crab Onions',
						// 	absFolderPath: '/Crab Onions',
						// 	l: 'a79fa996-e90e-4f04-97c4-c84209bb8277:1',
						// 	luuid: '1127af1b-7a31-4554-a693-1ef0b83b47ac',
						// 	checked: true,
						// 	f: '#',
						// 	color: 5,
						// 	view: 'appointment',
						// 	rev: 358,
						// 	ms: 5801,
						// 	n: 10,
						// 	s: 0,
						// 	i4ms: 7511,
						// 	i4next: 2260,
						// 	activesyncdisabled: false,
						// 	webOfflineSyncDays: 0,
						// 	perm: 'rwidxc',
						// 	recursive: false,
						// 	deletable: true,
						// 	isLink: false,
						// 	children: [],
						// 	depth: 2
						// },
						{
							id: `${identity.id}:${FOLDERS.DRAFTS}`,
							uuid: faker.datatype.uuid(),
							name: 'Drafts',
							absFolderPath: '/Drafts',
							l: `${identity.id}:${FOLDERS.USER_ROOT}`,
							luuid: sharedAccountRootId,
							checked: false,
							view: 'message',
							rev: 1,
							ms: 1,
							n: 0,
							s: 0,
							i4ms: 5089,
							i4next: 1581,
							activesyncdisabled: false,
							webOfflineSyncDays: 30,
							perm: 'rwidxc',
							recursive: false,
							deletable: false,
							isLink: false,
							children: [],
							depth: 2
						},
						{
							id: `${identity.id}:${FOLDERS.INBOX}`,
							uuid: faker.datatype.uuid(),
							name: 'Inbox',
							absFolderPath: '/Inbox',
							l: `${identity.id}:${FOLDERS.USER_ROOT}`,
							luuid: sharedAccountRootId,
							checked: false,
							f: 'u',
							color: '1',
							u: 2,
							view: 'message',
							rev: 1,
							ms: 5711,
							n: 6,
							s: 808220,
							i4ms: 7509,
							i4next: 2258,
							activesyncdisabled: false,
							webOfflineSyncDays: 30,
							perm: 'rwidxc',
							recursive: false,
							deletable: false,
							isLink: false,
							children: [],
							depth: 2
						},
						{
							id: `${identity.id}:${FOLDERS.SPAM}`,
							uuid: faker.datatype.uuid(),
							name: 'Junk',
							absFolderPath: '/Junk',
							l: `${identity.id}:${FOLDERS.USER_ROOT}`,
							luuid: sharedAccountRootId,
							checked: false,
							view: 'message',
							rev: 1,
							ms: 1,
							n: 1,
							s: 651070,
							i4ms: 6583,
							i4next: 1984,
							activesyncdisabled: false,
							webOfflineSyncDays: 0,
							perm: 'rwidxc',
							recursive: false,
							deletable: false,
							isLink: false,
							children: [],
							depth: 2
						},
						{
							id: `${identity.id}:${FOLDERS.SENT}`,
							uuid: faker.datatype.uuid(),
							name: 'Sent',
							absFolderPath: '/Sent',
							l: `${identity.id}:${FOLDERS.USER_ROOT}`,
							luuid: sharedAccountRootId,
							checked: false,
							f: 'u',
							u: 4,
							view: 'message',
							rev: 1,
							ms: 1,
							n: 89,
							s: 17340460,
							i4ms: 7500,
							i4next: 2255,
							activesyncdisabled: false,
							webOfflineSyncDays: 30,
							perm: 'rwidxc',
							recursive: false,
							deletable: false,
							isLink: false,
							children: [],
							depth: 2
						},
						{
							id: `${identity.id}:${FOLDERS.TRASH}`,
							uuid: faker.datatype.uuid(),
							name: 'Trash',
							absFolderPath: '/Trash',
							l: `${identity.id}:${FOLDERS.USER_ROOT}`,
							luuid: sharedAccountRootId,
							checked: true,
							f: '#',
							rev: 1,
							ms: 5798,
							n: 2,
							s: 18205,
							i4ms: 7476,
							i4next: 2147,
							activesyncdisabled: false,
							webOfflineSyncDays: 30,
							perm: 'rwidxc',
							recursive: false,
							deletable: false,
							isLink: false,
							children: [],
							depth: 2
						}
					],
					depth: 1
				};
			}
		);
	};

	const result = {
		USER: {
			id: '1',
			uuid: rootId,
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
					id: '683',
					uuid: '07300c2a-cf85-49f3-92db-31469438a701',
					name: 'blacklisted',
					absFolderPath: '/blacklisted',
					l: '1',
					luuid: rootId,
					checked: false,
					f: 'i',
					view: 'contact',
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
						grant: [generateGrant(getRandomIdentity(mocksContext.otherUsersIdentities), 'usr', 'r')]
					},
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '16',
					uuid: 'cb25cd60-209b-4b12-a3ff-2b69714ae19b',
					name: 'Briefcase',
					absFolderPath: '/Briefcase',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'document',
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
					depth: 1
				},
				{
					id: '10',
					uuid: 'c8c342d4-55f9-49b8-bc08-f056bf3ad11a',
					name: 'Calendar',
					absFolderPath: '/Calendar',
					l: '1',
					luuid: rootId,
					checked: true,
					f: 'b#i',
					color: '6',
					view: 'appointment',
					rev: 1,
					ms: 29489,
					n: 149,
					s: 0,
					i4ms: 31834,
					i4next: 15903,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					acl: {
						grant: generateGrants(mocksContext.otherUsersIdentities, 'usr', 'r', 2)
					},
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '7',
					uuid: '095d871a-a286-4055-aa90-870e09703086',
					name: 'Contacts',
					absFolderPath: '/Contacts',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'contact',
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
					depth: 1
				},
				{
					id: '6',
					uuid: '8d438ed1-5d63-4bfb-8059-0ef93812a488',
					name: 'Drafts',
					absFolderPath: '/Drafts',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'message',
					rev: 1,
					ms: 1,
					n: 3,
					s: 5482,
					i4ms: 31859,
					i4next: 16329,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '13',
					uuid: 'c3b5c4ec-ccf3-44d5-ad2e-daf64478b376',
					name: 'Emailed Contacts',
					absFolderPath: '/Emailed Contacts',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'contact',
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
					depth: 1
				},
				{
					id: '2',
					uuid: 'd1bf81a3-ceb9-409a-9cf5-ae987b42e11f',
					name: 'Inbox',
					absFolderPath: '/Inbox',
					l: '1',
					luuid: rootId,
					checked: false,
					f: 'ui',
					u: 15,
					view: 'message',
					rev: 1,
					ms: 2633,
					n: 858,
					s: 172793510,
					i4ms: 31803,
					i4next: 16294,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					acl: {},
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '4',
					uuid: '79f635be-b737-4842-aaf3-3e04b727804d',
					name: 'Junk',
					absFolderPath: '/Junk',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'message',
					rev: 1,
					ms: 1,
					n: 1,
					s: 52155,
					i4ms: 30321,
					i4next: 15602,
					activesyncdisabled: false,
					webOfflineSyncDays: 0,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '5',
					uuid: 'ca112c56-5e93-4319-912c-3af86d93dc8f',
					name: 'Sent',
					absFolderPath: '/Sent',
					l: '1',
					luuid: rootId,
					checked: false,
					view: 'message',
					rev: 1,
					ms: 1,
					n: 289,
					s: 61918425,
					i4ms: 31800,
					i4next: 16201,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					depth: 1
				},
				{
					id: '15',
					uuid: '202ad975-dd54-48d2-8d6c-a46fb4eb7300',
					name: 'Tasks',
					absFolderPath: '/Tasks',
					l: '1',
					luuid: rootId,
					checked: true,
					f: '#',
					view: 'task',
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
					children: [],
					depth: 1
				},
				{
					id: '3',
					uuid: '9222abe3-e35d-4e8b-bacc-723e3253954c',
					name: 'Trash',
					absFolderPath: '/Trash',
					l: '1',
					luuid: rootId,
					checked: false,
					rev: 1,
					ms: 28502,
					n: 192,
					s: 1612233,
					i4ms: 31856,
					i4next: 16328,
					activesyncdisabled: false,
					webOfflineSyncDays: 30,
					recursive: false,
					deletable: false,
					isLink: false,
					children: [],
					depth: 1
				},
				...generateLinkedCalendars(mocksContext.otherUsersIdentities),
				...generateLinkedAddressBooks(mocksContext.otherUsersIdentities),
				...generateSharedAccountsFolderStructure(
					mocksContext.identities.sendAs.map((contextIdentity) => contextIdentity.identity),
					1
				)
			],
			depth: 0
		}
	} as Roots;

	return result;
};
