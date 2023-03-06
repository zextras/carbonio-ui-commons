/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { cloneDeep, merge, times } from 'lodash';
import { SignItemType } from '../../../../types';
import { createFakeIdentity, FakeIdentity } from '../accounts/fakeAccounts';

/**
 * Number of alias identities to generate
 */
const ALIASES_IDENTITIES_COUNT = 2;

/**
 * Number of accounts on which the current user has the "sendAs" right
 */
const SENDAS_IDENTITIES_COUNT = 1;

/**
 * Number of accounts on which the current user has the "sendOnBehalfOf" right
 */
const SENDONBEHALF_IDENTITIES_COUNT = 0;

/**
 * Number of accounts on which the current user has the "view free/busy status" right
 */
const VIEWFREEBUSY_IDENTITIES_COUNT = 1;

type MocksContextIdentity = {
	identity: FakeIdentity;
	signatures?: {
		newEmailSignature: SignItemType;
		forwardReplySignature: SignItemType;
	};
};

type MocksContext = {
	identities: {
		primary: MocksContextIdentity;
		aliases: Array<MocksContextIdentity>;
		sendAs: Array<MocksContextIdentity>;
		sendOnBehalf: Array<MocksContextIdentity>;
	};
	aliasAddresses: Array<string>;
	viewFreeBusyIdentites: Array<FakeIdentity>;
};

/**
 * Generate a signature
 */
const generateSignature = (): SignItemType => {
	const title = faker.name.jobTitle();
	return {
		name: title,
		id: faker.datatype.uuid(),
		label: title,
		description: title,
		content: [
			{
				type: 'text/html',
				_content: `<div>${title}</div>\n<div><span style="color: #ff0000;"><em>${faker.name.jobType()}</em></span></div>\n<div>&nbsp;</div>`
			}
		]
	};
};

/**
 * Generates a default context with consistent random data
 */
// TODO restore signatures!!!!!!!!!!!!!!!!!!
const generateDefaultContext = (): MocksContext => {
	const primary = createFakeIdentity();
	const aliases = times(ALIASES_IDENTITIES_COUNT, () => createFakeIdentity());

	return {
		identities: {
			primary: {
				identity: primary,
				signatures: {
					newEmailSignature: generateSignature(),
					forwardReplySignature: generateSignature()
				}
			},
			aliases: aliases.map((alias) => ({
				identity: alias,
				signatures: {
					newEmailSignature: generateSignature(),
					forwardReplySignature: generateSignature()
				}
			})),
			sendAs: times(SENDAS_IDENTITIES_COUNT, () => ({
				identity: createFakeIdentity(),
				signatures: {
					newEmailSignature: generateSignature(),
					forwardReplySignature: generateSignature()
				}
			})),
			sendOnBehalf: times(SENDONBEHALF_IDENTITIES_COUNT, () => ({
				identity: createFakeIdentity(),
				signatures: {
					newEmailSignature: generateSignature(),
					forwardReplySignature: generateSignature()
				}
			}))
		},
		aliasAddresses: aliases.map((alias) => alias.email),
		viewFreeBusyIdentites: times(VIEWFREEBUSY_IDENTITIES_COUNT, () => createFakeIdentity())
	};
};

// The current context, preset with random data
const context: MocksContext = generateDefaultContext();

// const setMocksContext = (customContext: Partial<MocksContext>): MocksContext => ({
// 	identities: {
// 		primary: { ...context.identities.primary, ...customContext?.identities?.primary },
// 		others: [...context.identities.others, ...(customContext?.identities?.others ?? [])]
// 	}
// });

// Set custom values for the part of the context
const setMocksContext = (customContext: Partial<MocksContext>): MocksContext =>
	merge(context, customContext);

// Return a copy of the current context
const getMocksContext = (): MocksContext => cloneDeep(context);

export { MocksContext, getMocksContext, setMocksContext, generateDefaultContext };
