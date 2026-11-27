/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { orderBy } from 'lodash';

import { resolveFolderColorHex } from '../components/select/folders/utils';
import type { Tag } from '../types/tags';

/**
 * Resolves a tag's color into a single hex string: an `rgb` custom color takes precedence,
 * otherwise the standard color at `color` index. Tags share the standard folder palette.
 */
export const resolveTagColorHex = (
	tag: { color?: Tag['color'] | string; rgb?: Tag['rgb'] } | undefined
): string => resolveFolderColorHex(tag?.color, tag?.rgb);

const parseHex = (hex: string): [number, number, number] => {
	const value = hex.replace('#', '');
	const full =
		value.length === 3
			? value
					.split('')
					.map((char) => char + char)
					.join('')
			: value;
	return [0, 2, 4].map((start) => Number.parseInt(full.slice(start, start + 2), 16)) as [
		number,
		number,
		number
	];
};

/** WCAG relative luminance of a hex colour, from 0 (black) to 1 (white). */
export const getRelativeLuminance = (hex: string): number => {
	const [r, g, b] = parseHex(hex).map((channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Border of a pill whose colour is close to white, which would otherwise vanish on a white row. */
export const NEAR_WHITE_TAG_PILL_BORDER = '#c9ced6';

/** How much a pill's background tint grows on hover, in alpha points. */
const TAG_PILL_HOVER_ALPHA_STEP = 0.1;

const getTagPillTintAlpha = (luminance: number): number => {
	if (luminance < 0.1) {
		return 0.16;
	}
	if (luminance < 0.35) {
		return 0.14;
	}
	if (luminance < 0.45) {
		return 0.16;
	}
	return 0.3;
};

export type TagPillColors = {
	background: string;
	hoverBackground: string;
	/** Only for near-white colours. */
	border: string | undefined;
};

/**
 * Background of a tag pill: the tag colour at a transparency chosen by its luminance, so that dark,
 * mid and light colours all read as a tint behind #333 text. Works with any custom rgb colour.
 */
export const getTagPillColors = (hex: string): TagPillColors => {
	const [r, g, b] = parseHex(hex);
	const luminance = getRelativeLuminance(hex);
	const alpha = getTagPillTintAlpha(luminance);
	const rgba = (a: number): string => `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
	return {
		background: rgba(alpha),
		hoverBackground: rgba(alpha + TAG_PILL_HOVER_ALPHA_STEP),
		border: luminance >= 0.9 ? NEAR_WHITE_TAG_PILL_BORDER : undefined
	};
};

/** Tags in alphabetical order, ignoring case, as in the tag menu. Returns a new array. */
export const sortTagsByName = <T extends Pick<Tag, 'name'>>(tags: ReadonlyArray<T>): Array<T> =>
	orderBy(tags, (tag) => tag.name.toLowerCase(), 'asc');
