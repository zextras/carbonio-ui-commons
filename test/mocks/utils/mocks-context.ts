/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { Folder } from '@zextras/carbonio-shell-ui';
import { clone, cloneDeep, merge, times } from 'lodash';
import { SignItemType } from '../../../../types';
import { createFakeIdentity, FakeIdentity } from '../accounts/fakeAccounts';

/**
 * Number of alias identities to generate
 */
const DEFAULT_ALIASES_IDENTITIES_COUNT = 2;

/**
 * Number of accounts on which the current user has the "sendAs" right
 */
const DEFAULT_SENDAS_IDENTITIES_COUNT = 1;

/**
 * Number of accounts on which the current user has the "sendOnBehalfOf" right
 */
const DEFAULT_SENDONBEHALF_IDENTITIES_COUNT = 1;

/**
 * Number of accounts on which the current user has the "view free/busy status" right
 */
const DEFAULT_VIEWFREEBUSY_IDENTITIES_COUNT = 1;

/**
 * Indicates if the signatures should be generated
 */
const DEFAULT_GENERATE_SIGNATURES = true;

/**
 * Indicates if the folders should be generated
 */
const DEFAULT_GENERATE_FOLDERS = true;

const DEFAULT_GENERATE_FOLDERS_MAILS = true;
const DEFAULT_GENERATE_FOLDERS_CALENDARS = true;
const DEFAULT_GENERATE_FOLDERS_CONTACTS = true;
const DEFAULT_GENERATE_FOLDERS_SHARED_ACCOUNTS = true;

type MocksContextIdentity = {
	identity: FakeIdentity;
	signatures?: {
		newEmailSignature: SignItemType;
		forwardReplySignature: SignItemType;
	};
	folders?: Array<Folder>;
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

type MocksContextGenerationParams = {
	aliasIdentitiesCount?: number;
	sendAsIdentititesCount?: number;
	sendOnBehalfIdentitiesCount?: number;
	viewFreeBusyIdentitiesCount?: number;
	generateSignatures?: boolean;
	generateFolders?: boolean;
	generateFoldersMails?: boolean;
	generateFoldersCalendars?: boolean;
	generateFoldersContacts?: boolean;
	generateFoldersSharedAccounts?: boolean;
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
 * @param params
 */
const generateDefaultContext = ({
	aliasIdentitiesCount = DEFAULT_ALIASES_IDENTITIES_COUNT,
	sendAsIdentititesCount = DEFAULT_SENDAS_IDENTITIES_COUNT,
	sendOnBehalfIdentitiesCount = DEFAULT_SENDONBEHALF_IDENTITIES_COUNT,
	viewFreeBusyIdentitiesCount = DEFAULT_VIEWFREEBUSY_IDENTITIES_COUNT,
	generateSignatures = DEFAULT_GENERATE_SIGNATURES,
	generateFolders = DEFAULT_GENERATE_FOLDERS,
	generateFoldersMails = DEFAULT_GENERATE_FOLDERS_MAILS,
	generateFoldersCalendars = DEFAULT_GENERATE_FOLDERS_CALENDARS,
	generateFoldersContacts = DEFAULT_GENERATE_FOLDERS_CONTACTS,
	generateFoldersSharedAccounts = DEFAULT_GENERATE_FOLDERS_SHARED_ACCOUNTS
}: MocksContextGenerationParams): MocksContext => {
	const primary = createFakeIdentity();
	const aliases = times(aliasIdentitiesCount, () => createFakeIdentity());

	return {
		identities: {
			primary: {
				identity: primary,
				...(generateSignatures && {
					signatures: {
						newEmailSignature: generateSignature(),
						forwardReplySignature: generateSignature()
					}
				}),
				...(generateFolders && {
					folders: {
						newEmailSignature: generateSignature(),
						forwardReplySignature: generateSignature()
					}
				})
			},
			aliases: aliases.map((alias) => ({
				identity: alias,
				...(generateSignatures && {
					signatures: {
						newEmailSignature: generateSignature(),
						forwardReplySignature: generateSignature()
					}
				})
			})),
			sendAs: times(sendAsIdentititesCount, () => ({
				identity: createFakeIdentity(),
				...(generateSignatures && {
					signatures: {
						newEmailSignature: generateSignature(),
						forwardReplySignature: generateSignature()
					}
				})
			})),
			sendOnBehalf: times(sendOnBehalfIdentitiesCount, () => ({
				identity: createFakeIdentity(),
				...(generateSignatures && {
					signatures: {
						newEmailSignature: generateSignature(),
						forwardReplySignature: generateSignature()
					}
				})
			}))
		},
		aliasAddresses: aliases.map((alias) => alias.email),
		viewFreeBusyIdentites: times(viewFreeBusyIdentitiesCount, () => createFakeIdentity())
	};
};

// The current context, preset with random data
let context: MocksContext = generateDefaultContext({});

// Set custom values for the part of the context
const updateMocksContext = (customContext: Partial<MocksContext>): MocksContext =>
	merge(context, customContext);

// Set custom values for the part of the context
const setMocksContext = (customContext: MocksContext): void => {
	context = cloneDeep(customContext);
};

// Return a copy of the current context
const getMocksContext = (): MocksContext => cloneDeep(context);

export {
	MocksContext,
	getMocksContext,
	setMocksContext,
	updateMocksContext,
	generateDefaultContext
};
