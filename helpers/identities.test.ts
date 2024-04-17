/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { http } from 'msw';

import { getSetupServer } from '../test/jest-setup';
import { handleGetShareInfoRequest } from '../test/mocks/network/msw/handle-get-share-info';
import { getMocksContext } from '../test/mocks/utils/mocks-context';

describe('Default account address', () => {
	const mocksContext = getMocksContext();
	test('returns the address if default account selected as a FROM', () => {
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		const inputAddress = mocksContext.identities.primary.identity.email;
		// expect(getSharedAccountsIds(inputAddress)).toBe('');
	});

	test('returns the address if sendAs account selected as a FROM', () => {
		getSetupServer().use(http.post('/service/soap/GetShareInfoRequest', handleGetShareInfoRequest));
		const inputAddress = mocksContext.identities.sendAs[0].identity.email;
		// expect(getSharedAccountsIds(inputAddress)).toBe('');
	});
});
