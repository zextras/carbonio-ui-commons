/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ZIMBRA_STANDARD_COLORS } from '../../constants/utils';
import { resolveTagColorHex } from '../tags';

describe('resolveTagColorHex', () => {
	test('returns the custom rgb color when present, ignoring the standard color index', () => {
		expect(resolveTagColorHex({ color: 3, rgb: '#123456' })).toBe('#123456');
	});

	test('returns the standard color at the given index when there is no rgb', () => {
		expect(resolveTagColorHex({ color: 5 })).toBe(ZIMBRA_STANDARD_COLORS[5].hex);
	});

	test('accepts the color index as a string', () => {
		expect(resolveTagColorHex({ color: '4' })).toBe(ZIMBRA_STANDARD_COLORS[4].hex);
	});

	test('falls back to the first standard color when the tag has no color', () => {
		expect(resolveTagColorHex({})).toBe(ZIMBRA_STANDARD_COLORS[0].hex);
	});

	test('falls back to the first standard color when the tag is undefined', () => {
		expect(resolveTagColorHex(undefined)).toBe(ZIMBRA_STANDARD_COLORS[0].hex);
	});
});
