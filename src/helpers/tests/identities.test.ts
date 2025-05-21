/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { http } from 'msw';

import { getSetupServer } from '../../test/jest-setup';
import { handleGetShareInfoRequest } from '../../test/mocks/network/msw/handle-get-share-info';
import { getMocksContext } from '../../test/mocks/utils/mocks-context';
import { getOrderedAccountIds } from '../identities';

describe('Default account address', () => {
	const mocksContext = getMocksContext();
	test('returns the address if default account selected as a FROM', async () => {
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		const { identity } = mocksContext.identities.primary;
		const orderedIds = await getOrderedAccountIds(identity.email);
		expect(orderedIds.includes(identity.id));
	});

	test('returns the address if sendAs account selected as a FROM', async () => {
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		const { identity } = mocksContext.identities.sendAs[0];
		const orderedIds = await getOrderedAccountIds(identity.email);
		expect(orderedIds.includes(identity.id));
	});
});
