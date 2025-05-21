/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHistoryNavigation } from './use-history-navigation';
import { setupHook } from '../test/test-setup';

describe('useHistoryNavigation', () => {
	it('should return an object with two functions', () => {
		const {
			result: { current: navigation }
		} = setupHook(useHistoryNavigation);

		expect(navigation).toEqual({
			replaceHistory: expect.any(Function),
			pushHistory: expect.any(Function)
		});
	});
});
