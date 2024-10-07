/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Account, getUserAccount, getUserSettings } from '@zextras/carbonio-shell-ui';
import { TFunction } from 'i18next';
import { filter, findIndex, flatten, isArray, map, remove, sortBy } from 'lodash';

import { getShareInfoRequest } from '../soap/get-share-info';
import { AvailableAddress, IdentityDescriptor } from '../types/identities';

type AccountItem = {
	id: string;
	address: string;
};

export function getSharedAccounts(): Promise<Array<AccountItem>> {
	return getShareInfoRequest().then((res) => {
		const sharedAccounts: Array<AccountItem> = [];
		if (res?.folders) {
			const sharedRootFolders = filter(res.folders, ['folderId', 1]);
			sharedRootFolders.forEach((account) => {
				if (account.ownerId && account.ownerEmail) {
					sharedAccounts.push({ id: account.ownerId, address: account.ownerEmail });
				}
			});
		}
		return sharedAccounts;
	});
}

export function getDefaultAccount(): AccountItem | undefined {
	const account = getUserAccount();
	if (!account) {
		return undefined;
	}
	return { id: account.id, address: account.name };
}

export async function getOrderedAccountIds(
	priorityAccountAddress?: string
): Promise<Array<string>> {
	const sharedAccounts = await getSharedAccounts();
	const defaultAccount = getDefaultAccount();
	const finalList = defaultAccount ? [defaultAccount].concat(...sharedAccounts) : sharedAccounts;
	const sortedList = sortBy(finalList, (item: AccountItem) =>
		item.address === priorityAccountAddress ? 0 : 1
	);
	return map(sortedList, (item: AccountItem) => item.id);
}

/**
 * The name of the primary identity
 */
const PRIMARY_IDENTITY_NAME = 'DEFAULT';

const NO_ACCOUNT_NAME = 'No account';

/**
 * The type of the identities whose address does not match with any of the available addresses
 */
const UNKNOWN_IDENTITY_DEFAULT_TYPE = 'alias';

/**
 * Returns the list of all the available addresses for the account and their type
 */
const getAvailableAddresses = (): Array<AvailableAddress> => {
	const account = getUserAccount();
	const settings = getUserSettings();
	const result: Array<AvailableAddress> = [];

	// Adds the email address of the primary account
	result.push({
		address: account?.name ?? NO_ACCOUNT_NAME,
		type: 'primary',
		ownerAccount: account?.name ?? NO_ACCOUNT_NAME
	});

	// Adds all the aliases
	if (settings.attrs.zimbraMailAlias) {
		if (isArray(settings.attrs.zimbraMailAlias)) {
			result.push(
				...(settings.attrs.zimbraMailAlias as string[]).map<AvailableAddress>((alias: string) => ({
					address: alias,
					type: 'alias',
					ownerAccount: account?.name ?? NO_ACCOUNT_NAME
				}))
			);
		} else {
			result.push({
				address: settings.attrs.zimbraMailAlias as string,
				type: 'alias',
				ownerAccount: account?.name ?? NO_ACCOUNT_NAME
			});
		}
	}

	// Adds the email addresses of all the delegation accounts
	if (account?.rights?.targets) {
		account.rights.targets.forEach((target) => {
			if (target.target && (target.right === 'sendAs' || target.right === 'sendOnBehalfOf')) {
				target.target.forEach((user) => {
					if (user.type === 'account' && user.email) {
						user.email.forEach((email) => {
							result.push({
								address: email.addr,
								type: 'delegation',
								right: target.right,
								ownerAccount: email.addr
							});
						});
					}
				});
			}
		});
	}

	return result;
};

/**
 *
 * @param identities
 */
const sortIdentities = (
	identities: Account['identities']['identity']
): Account['identities']['identity'] => {
	const allIdentities = [...identities];
	const defaultIdentity = remove(
		allIdentities,
		(identity) => identity.name === PRIMARY_IDENTITY_NAME
	);
	return [...defaultIdentity, ...allIdentities];
};

/**
 * @param email
 * @param rights
 */
const generateIdentityId = (email: string, rights: string): string => email + rights;

/**
 * Returns the list of all the identities for the account. For each identity a type
 * is give, by matching the email address with all the available addresses, or by
 * setting a default one if the address does not match any of the available addresses.
 *
 * The function returns also an identity for each account for which the user is a delegate
 * (sendAs or sendOnBehalfOf) if there is no an already existing identity
 */
export const getIdentitiesDescriptors = (): Array<IdentityDescriptor> => {
	const account = getUserAccount();
	const identities: Array<IdentityDescriptor> = [];

	// Get the list of all the available email addresses for the account and their type
	const availableEmailAddresses = getAvailableAddresses();
	account?.identities?.identity &&
		sortIdentities(account.identities.identity)?.forEach((identity) => {
			const fromAddress = identity._attrs?.zimbraPrefFromAddress ?? '';
			const fromDisplay = identity._attrs?.zimbraPrefFromDisplay ?? '';

			// The receiving address for the primary identity is the account name
			const receivingAddress = identity.name === PRIMARY_IDENTITY_NAME ? account.name : fromAddress;

			// Find the first match between the identity receiving email address and the available email addresses
			const matchingReceivingAddress = availableEmailAddresses.find(
				(availableAddress) => availableAddress.address === receivingAddress
			);

			const type = matchingReceivingAddress
				? matchingReceivingAddress.type
				: UNKNOWN_IDENTITY_DEFAULT_TYPE;

			const right =
				type === 'delegation' && matchingReceivingAddress
					? matchingReceivingAddress.right
					: undefined;

			identities.push({
				ownerAccount: matchingReceivingAddress?.ownerAccount ?? account.name,
				receivingAddress,
				id: identity._attrs?.zimbraPrefIdentityId ?? '',
				identityName: identity.name ?? '',
				identityDisplayName: identity._attrs?.zimbraPrefIdentityName ?? '',
				fromDisplay,
				fromAddress,
				type,
				right,
				defaultSignatureId: identity._attrs?.zimbraPrefDefaultSignatureId,
				forwardReplySignatureId: identity._attrs?.zimbraPrefForwardReplySignatureId
			});
		});

	const delegationAccounts = filter(
		account?.rights?.targets,
		(rts) => rts.right === 'sendAs' || rts.right === 'sendOnBehalfOf'
	);

	const delegationIdentities = flatten(
		map(delegationAccounts, (ele) =>
			map(ele?.target, (item: { d: string; type: string; email: Array<{ addr: string }> }) => ({
				ownerAccount: item.email[0].addr ?? account?.name ?? NO_ACCOUNT_NAME,
				receivingAddress: item.email[0].addr,
				id: generateIdentityId(item.email[0].addr, ele.right),
				identityName: item.d,
				identityDisplayName: item.d,
				fromDisplay: item.d,
				fromAddress: item.email[0].addr,
				type: 'delegation',
				right: ele.right
			}))
		)
	);

	const uniqueIdentityList: IdentityDescriptor[] = [...identities];
	if (delegationIdentities?.length) {
		map(delegationIdentities, (ele: IdentityDescriptor) => {
			const uniqIdentity = findIndex(identities, { fromAddress: ele.fromAddress });
			if (uniqIdentity < 0) uniqueIdentityList.push(ele);
		});
		return uniqueIdentityList;
	}

	return identities;
};

const getDefaultIdentity = (): IdentityDescriptor =>
	getIdentitiesDescriptors().reduce((result, identity) =>
		identity.identityName === PRIMARY_IDENTITY_NAME ? identity : result
	);

/**
 *
 * @param identity
 * @param t
 */
export const getIdentityDescription = (
	identity: IdentityDescriptor,
	t: TFunction
): string | null => {
	if (!identity) {
		return null;
	}
	const defaultIdentity = getDefaultIdentity();

	return identity.right === 'sendOnBehalfOf'
		? `${t('label.on_behalf_of', 'on behalf of', {
				accountName: defaultIdentity.fromDisplay ?? '',
				identity: identity.fromDisplay ?? identity.identityName,
				otherAccount: identity.fromAddress
			})}`
		: `${identity.identityName ?? ''} (${identity.fromDisplay ?? ''} <${identity.fromAddress}>)`;
};
