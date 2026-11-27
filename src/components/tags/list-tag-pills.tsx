/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { memo, useMemo, useRef } from 'react';

import styled from '@emotion/styled';
import { Text } from '@zextras/carbonio-design-system';

import { IconTagPill, TagPill } from './tag-pill';
import { fitTagPills, LIST_TAG_PILLS_GAP, TagPillSlot } from './tag-pills-fit';
import { getTagPillColors } from '../../helpers/tags';

export type TagPillItem = {
	id: string;
	name: string;
	/** Hex colour (see `resolveTagColorHex`); not used for shared tags. */
	color?: string;
	/** Set by the owner of a shared folder. */
	shared?: boolean;
	/** Tooltip of a shared tag, e.g. whose folder it comes from. Translated. */
	tooltip?: string;
};

const LIST_PILL_FONT_SIZE_PX = 12;
/** Padding (6 + 8), the 12px tag icon and the 6px gap after it, around the name of a small pill. */
const LIST_PILL_CHROME_PX = 32;
/** A shared or near-white pill: a 1px border on each side. */
const BORDER_PX = 2;
/** Horizontal padding of the "+N" text. */
const COUNTER_PADDING_PX = 4;
/** Narrowest "+N" of a list row: a 24×24 target, however short its text. */
export const LIST_TAG_PILLS_COUNTER_MIN_WIDTH = 24;
const FONT_FAMILY = 'Roboto, sans-serif';

let measuringContext: OffscreenCanvasRenderingContext2D | null | undefined;
const measuredWidths = new Map<string, number>();

/**
 * Width of a text in the list's font, cached: every row measures the same few names. Falls back
 * to an estimate where there is no canvas (tests): the fit only needs to be close, the name is
 * truncated with an ellipsis anyway.
 */
const measureTextWidth = (text: string): number => {
	const cached = measuredWidths.get(text);
	if (cached !== undefined) {
		return cached;
	}
	if (measuringContext === undefined) {
		measuringContext =
			typeof OffscreenCanvas === 'undefined' ? null : new OffscreenCanvas(1, 1).getContext('2d');
	}
	if (!measuringContext) {
		return text.length * LIST_PILL_FONT_SIZE_PX * 0.55;
	}
	measuringContext.font = `${LIST_PILL_FONT_SIZE_PX}px ${FONT_FAMILY}`;
	const { width } = measuringContext.measureText(text);
	// Before Roboto loads the canvas measures the fallback font: keep that width out of the cache.
	if (typeof document === 'undefined' || document.fonts?.check(measuringContext.font) !== false) {
		measuredWidths.set(text, width);
	}
	return width;
};

const pillWidth = (tag: TagPillItem): number => {
	const width = Math.ceil(measureTextWidth(tag.name)) + LIST_PILL_CHROME_PX;
	const bordered = tag.shared || (tag.color !== undefined && getTagPillColors(tag.color).border);
	return bordered ? width + BORDER_PX : width;
};

/**
 * Width of "+N" with its padding, at least `LIST_TAG_PILLS_COUNTER_MIN_WIDTH`: the list's own counter,
 * or a button of the same size.
 */
export const listTagPillsCounterWidth = (hiddenCount: number): number =>
	Math.max(
		Math.ceil(measureTextWidth(`+${hiddenCount}`)) + COUNTER_PADDING_PX,
		LIST_TAG_PILLS_COUNTER_MIN_WIDTH
	);

const pxToRem = (px: number): string => `${px / 16}rem`;

const slotMaxWidth = (slot: TagPillSlot): string | undefined =>
	slot.kind === 'pill' && slot.maxWidth !== undefined ? pxToRem(slot.maxWidth) : undefined;

/** secondary.active rather than secondary: #828282 is below 4.5:1 on white at 12px. */
const Counter = styled(Text)`
	box-sizing: border-box;
	min-width: ${pxToRem(LIST_TAG_PILLS_COUNTER_MIN_WIDTH)};
	padding: 0 0.125rem;
	text-align: center;
	color: ${({ theme }): string => theme.palette.secondary.active};
`;

const Tags = styled.span`
	display: flex;
	align-items: center;
	flex: none;
	min-width: 0;
	gap: ${pxToRem(LIST_TAG_PILLS_GAP)};
`;

type ShownTag = { tag: TagPillItem; slot: TagPillSlot };

export type ListTagPillsProps = {
	/** In display order (see `sortTagsByName`; shared tags last). */
	tags: ReadonlyArray<TagPillItem>;
	/** Width of the line the tags share with the subject (or the fragment), in px. */
	lineWidth: number;
	/**
	 * What stands for the tags that don't fit, in place of the plain "+N": e.g. a button that opens
	 * them. Rendered outside the part hidden from screen readers. While `frozen` it is called also
	 * when no hidden tag is left, so that the caller can close what it opened.
	 */
	renderMore?: (hidden: ReadonlyArray<TagPillItem>) => React.ReactNode;
	/**
	 * While true, the tags shown keep their place and kind, whatever the width: e.g. while the hidden
	 * ones are open. A removed tag leaves; the hidden ones are the rest.
	 */
	frozen?: boolean;
};

/**
 * The tags of a list row: pills while they fit in 40% of the line, then icon-only pills, then "+N"
 * (see `fitTagPills`). The pills are read-only and hidden from screen readers: the row's accessible
 * name lists the tags.
 */
export const ListTagPills = memo(function ListTagPills({
	tags,
	lineWidth,
	renderMore,
	frozen = false
}: Readonly<ListTagPillsProps>): React.JSX.Element | null {
	const pillWidths = useMemo(() => tags.map(pillWidth), [tags]);
	const fitted = useMemo<ReadonlyArray<ShownTag>>(() => {
		const { slots } = fitTagPills({
			lineWidth,
			pillWidths,
			counterWidth: listTagPillsCounterWidth
		});
		return slots.map((slot, index) => ({ tag: tags[index], slot }));
	}, [lineWidth, pillWidths, tags]);

	// The layout of the last render that was not frozen: the one the user is looking at.
	const lastFitted = useRef(fitted);
	if (!frozen) {
		lastFitted.current = fitted;
	}
	const frozenLayout = lastFitted.current;
	const shown = useMemo<ReadonlyArray<ShownTag>>(() => {
		if (!frozen) {
			return fitted;
		}
		const byId = new Map(tags.map((tag) => [tag.id, tag]));
		return frozenLayout.flatMap(({ tag, slot }) => {
			const current = byId.get(tag.id);
			return current ? [{ tag: current, slot }] : [];
		});
	}, [fitted, frozen, frozenLayout, tags]);
	const hidden = useMemo(() => {
		const shownIds = new Set(shown.map(({ tag }) => tag.id));
		return tags.filter((tag) => !shownIds.has(tag.id));
	}, [shown, tags]);

	if (tags.length === 0) {
		return null;
	}

	return (
		<Tags data-testid="list-tag-pills">
			<Tags aria-hidden="true">
				{shown.map(({ tag, slot }) =>
					slot.kind === 'icon' ? (
						<IconTagPill
							key={tag.id}
							name={tag.name}
							color={tag.color}
							shared={tag.shared}
							tooltip={tag.tooltip}
						/>
					) : (
						<TagPill
							key={tag.id}
							name={tag.name}
							color={tag.color}
							shared={tag.shared}
							tooltip={tag.tooltip}
							maxWidth={slotMaxWidth(slot)}
						/>
					)
				)}
				{hidden.length > 0 && !renderMore && (
					<Counter size="extrasmall" data-testid="hidden-tags-count">
						+{hidden.length}
					</Counter>
				)}
			</Tags>
			{(hidden.length > 0 || frozen) && renderMore?.(hidden)}
		</Tags>
	);
});
