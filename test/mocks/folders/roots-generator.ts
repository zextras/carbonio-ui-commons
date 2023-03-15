/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { Roots } from '@zextras/carbonio-shell-ui';
import { getMocksContext, MocksContext, MocksContextIdentity } from '../utils/mocks-context';

/**
 *
 */
let rootIdCounter = 100;

/**
 *
 * @param primaryContextIdentity
 * @param sharedContextIdentity
 */
const generateSharedAccountRoot = (
	primaryContextIdentity: MocksContextIdentity,
	sharedContextIdentity: MocksContextIdentity
): Roots => {
	const result = {
		[sharedContextIdentity.identity.email]: {
			absFolderPath: `/${sharedContextIdentity.identity.email}`,
			acl: undefined,
			activesyncdisabled: false,
			broken: false,
			checked: false,
			children: [],
			color: undefined,
			deletable: true,
			depth: 1,
			f: '*',
			i4ms: undefined,
			i4n: undefined,
			i4next: undefined,
			i4u: undefined,
			id: `${(rootIdCounter = +1)}`,
			isLink: true,
			l: '1',
			luuid: primaryContextIdentity.userRootId,
			md: undefined,
			meta: undefined,
			ms: 7037,
			n: 0,
			name: sharedContextIdentity.identity.email,
			oname: 'USER_ROOT',
			owner: sharedContextIdentity.identity.email,
			// parent
			// 	:
			// {
			// 	id: '1', uuid
			// :
			// 	primaryContextIdentityidentity.id , name
			// :
			// 	'USER_ROOT', absFolderPath
			// :
			// 	'/', l
			// :
			// 	'11'
			// }
			perm: 'rwidxc',
			recursive: false,
			reminder: false,
			retentionPolicy: undefined,
			rev: 7036,
			rgb: undefined,
			rid: '1',
			ruuid: faker.datatype.uuid(),
			s: 0,
			u: undefined,
			url: undefined,
			uuid: sharedContextIdentity.userRootId ?? '',
			view: undefined,
			webOfflineSyncDays: 0,
			zid: sharedContextIdentity.identity.id
		}
	};

	return result;
};

/**
 *
 * @param primaryContextIdentity
 * @param sharedContextIdentities
 */
const generateSharedAccountsRoot = (
	primaryContextIdentity: MocksContextIdentity,
	sharedContextIdentities: Array<MocksContextIdentity>
): Roots => {
	if (!primaryContextIdentity || !sharedContextIdentities || !sharedContextIdentities.length) {
		return {};
	}

	let result = {};
	sharedContextIdentities.forEach((sharedAccount) => {
		result = { ...result, ...generateSharedAccountRoot(primaryContextIdentity, sharedAccount) };
	});

	return result;
};

/**
 *
 */
export const generateRoots = (): Roots => {
	const { identities } = getMocksContext();

	const result = {
		USER: {
			id: '1',
			uuid: identities.primary.userRootId,
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
			children: [],
			depth: 0
		},
		...generateSharedAccountsRoot(identities.primary, identities.sendAs),
		...generateSharedAccountsRoot(identities.primary, identities.sendOnBehalf)
	} as Roots;

	return result;
};
