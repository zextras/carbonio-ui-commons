/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getUserAccount } from '@zextras/carbonio-shell-ui';
import { filter, map, sortBy } from 'lodash';

import { getShareInfoRequest } from '../soap/get-share-info';

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
