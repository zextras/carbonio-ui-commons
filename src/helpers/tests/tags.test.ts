/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ZIMBRA_STANDARD_COLORS } from '../../constants/utils';
import {
	getRelativeLuminance,
	getTagPillColors,
	resolveTagColorHex,
	sortTagsByName
} from '../tags';

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

describe('getRelativeLuminance', () => {
	test('is 0 for black and 1 for white', () => {
		expect(getRelativeLuminance('#000000')).toBe(0);
		expect(getRelativeLuminance('#ffffff')).toBe(1);
	});

	test('follows the WCAG formula for a mid colour', () => {
		// #2b73d2: 0.2126 * 0.0242 + 0.7152 * 0.1714 + 0.0722 * 0.6445
		expect(getRelativeLuminance('#2b73d2')).toBeCloseTo(0.1743, 3);
	});

	test('accepts the short hex form and upper case', () => {
		expect(getRelativeLuminance('#FFF')).toBe(1);
	});
});

describe('getTagPillColors', () => {
	test('a very dark colour gets a 16% tint and no border', () => {
		expect(getTagPillColors('#1b1f3b')).toEqual({
			background: 'rgba(27, 31, 59, 0.16)',
			hoverBackground: 'rgba(27, 31, 59, 0.26)',
			border: undefined
		});
	});

	test('a mid colour gets a 14% tint', () => {
		expect(getTagPillColors('#2b73d2')).toEqual({
			background: 'rgba(43, 115, 210, 0.14)',
			hoverBackground: 'rgba(43, 115, 210, 0.24)',
			border: undefined
		});
	});

	test('a light colour gets a 30% tint', () => {
		expect(getTagPillColors('#f6b7d6')).toEqual({
			background: 'rgba(246, 183, 214, 0.3)',
			hoverBackground: 'rgba(246, 183, 214, 0.4)',
			border: undefined
		});
	});

	test('a near-white colour gets a 30% tint and a grey border so the pill stays visible', () => {
		expect(getTagPillColors('#fffde7')).toEqual({
			background: 'rgba(255, 253, 231, 0.3)',
			hoverBackground: 'rgba(255, 253, 231, 0.4)',
			border: '#c9ced6'
		});
	});

	test('the thresholds are inclusive on their lower bound', () => {
		// #595959 has L ≈ 0.0999, #5a5a5a ≈ 0.1022
		expect(getTagPillColors('#595959').background).toBe('rgba(89, 89, 89, 0.16)');
		expect(getTagPillColors('#5a5a5a').background).toBe('rgba(90, 90, 90, 0.14)');
	});
});

describe('sortTagsByName', () => {
	test('orders tags alphabetically, ignoring case, without changing the input', () => {
		const tags = [
			{ id: '1', name: 'urgent' },
			{ id: '2', name: 'Client' },
			{ id: '3', name: 'board' }
		];

		expect(sortTagsByName(tags).map((tag) => tag.name)).toEqual(['board', 'Client', 'urgent']);
		expect(tags[0].name).toBe('urgent');
	});
});
