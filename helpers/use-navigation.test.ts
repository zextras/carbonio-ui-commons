/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from './use-navigation';
import { setupHook } from '../test/test-setup';

describe('useNavigation', () => {
	it('should return an object with two functions', () => {
		const {
			result: { current: navigation }
		} = setupHook(useNavigation);

		expect(navigation).toEqual({
			replaceHistory: expect.any(Function),
			pushHistory: expect.any(Function)
		});
	});
});
