/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { faker } from '@faker-js/faker';

type fakeIdentity = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	fullName: string;
};

const createFakeIdentity = (): fakeIdentity => {
	const firstName = faker?.name?.firstName?.() ?? '';
	const lastName = faker?.name?.lastName?.() ?? '';

	return {
		id: faker.datatype.uuid(),
		firstName,
		lastName,
		fullName: `${firstName} ${lastName}`,
		email: faker?.internet?.email?.(firstName, lastName) ?? ''
	};
};

/**
 *
 */
const getMockedAccountItem = (): any => {
	const identity1 = createFakeIdentity();
	const identity2 = createFakeIdentity();
	return {
		id: identity1.id,
		name: identity1.fullName,
		displayName: identity1.fullName,
		identities: {
			identity: [
				{
					id: identity1.id,
					name: 'DEFAULT',
					_attrs: {
						zimbraPrefIdentityName: 'DEFAULT',
						zimbraPrefIdentityId: '1',
						zimbraPrefWhenSentToEnabled: 'FALSE',
						zimbraPrefWhenInFoldersEnabled: 'FALSE',
						zimbraPrefFromAddressType: 'sendAs',
						zimbraPrefFromAddress: identity1.email,
						objectClass: 'zimbraIdentity',
						zimbraPrefFromDisplay: identity1.fullName,
						zimbraPrefReplyToEnabled: 'FALSE',
						zimbraCreateTimestamp: '20211227131653.367Z'
					}
				},
				{
					id: identity2.id,
					name: identity2.fullName,
					_attrs: {
						zimbraPrefFromAddressType: 'sendAs',
						zimbraPrefIdentityName: identity2.fullName,
						zimbraPrefIdentityId: '2',
						zimbraPrefWhenSentToEnabled: 'FALSE',
						zimbraPrefWhenInFoldersEnabled: 'FALSE',
						zimbraPrefFromAddress: identity2.email,
						objectClass: 'zimbraIdentity',
						zimbraPrefFromDisplay: identity2.fullName,
						zimbraPrefReplyToEnabled: 'FALSE',
						zimbraCreateTimestamp: '20211227131653.367Z'
					}
				}
			]
		},
		signatures: {
			signature: [
				{
					name: identity1.fullName,
					id: identity1.id,
					content: [
						{
							type: 'text/html',
							_content: `<div><span style="color:#333333;font-family:monospace">regards</span><br style="color:#333333;font-family:monospace" /><span style="color:#333333;font-family:monospace">${identity1.fullName}</span></div>`
						}
					]
				}
			]
		},
		rights: {
			targets: [
				{
					right: 'sendAs',
					target: [
						{
							type: 'account',
							email: [
								{
									addr: identity1.email
								}
							],
							d: identity1.fullName
						}
					]
				},
				{
					right: 'viewFreeBusy',
					target: [
						{
							type: 'account',
							id: '1',
							name: identity1.email,
							d: identity1.fullName
						}
					]
				},
				{
					right: 'sendOnBehalfOf',
					target: [
						{
							type: 'account',
							email: [
								{
									addr: identity2.email
								}
							],
							d: identity2.fullName
						}
					]
				}
			]
		}
	};
};

export { getMockedAccountItem, createFakeIdentity };
