/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';

import { useSortedTagsArray } from '../hooks';
import { useTagStore } from '../store';

describe('useSortedTagsArray', () => {
	it('should return the sorted tags array', () => {
		const tagA = { id: '2', name: 'a' };
		const tagB = { id: '3', name: 'b' };
		const tagC = { id: '1', name: 'c' };

		useTagStore.setState({ tags: { [tagB.id]: tagB, [tagC.id]: tagC, [tagA.id]: tagA } });
		const { result } = renderHook(() => useSortedTagsArray());

		expect(result.current).toEqual([tagA, tagB, tagC]);
	});
});
