/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { Container, Icon, Portal, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { CARD_WIDTH_PX, CardPosition, cardPosition } from './hidden-tags-card-position';
import { TagDot, TagPill } from './tag-pill';
import { fitTagPills, LIST_TAG_PILLS_GAP, TAG_PILLS_MAX_BUDGET } from './tag-pills-fit';
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
/** Padding (6 + 8), dot (8) and the gap after it (6) around the name of a small pill. */
const LIST_PILL_CHROME_PX = 28;
/** A shared pill: the 12px icon instead of the 8px dot, and a 1px border on each side. */
const SHARED_PILL_EXTRA_PX = 6;
/** A near-white pill: a 1px border on each side. */
const BORDER_PX = 2;
/** Horizontal padding of the "+N" text. */
const COUNTER_PADDING_PX = 4;
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
	const text = Math.ceil(measureTextWidth(tag.name)) + LIST_PILL_CHROME_PX;
	if (tag.shared) {
		return text + SHARED_PILL_EXTRA_PX;
	}
	return tag.color && getTagPillColors(tag.color).border ? text + BORDER_PX : text;
};

const counterWidth = (hiddenCount: number): number =>
	Math.ceil(measureTextWidth(`+${hiddenCount}`)) + COUNTER_PADDING_PX;

const pxToRem = (px: number): string => `${px / 16}rem`;

/** Delay before the hidden-tags card opens, so it doesn't flash while the pointer crosses a row. */
export const HIDDEN_TAGS_CARD_DELAY_MS = 300;

const Counter = styled(Text)`
	padding: 0 0.125rem;
	cursor: default;
	color: ${({ theme }): string => theme.palette.secondary.active};

	&:hover {
		text-decoration: underline;
	}
`;

/**
 * Not the DS Popover: its Popper moves the focus into itself when it opens, which would take it
 * away from whatever the user is typing in while the pointer rests on "+N".
 */
const Card = styled.div`
	position: fixed;
	/* As the DS Popper: above the boards, below dropdowns and modals (999). */
	z-index: 99;
	box-sizing: border-box;
	width: ${pxToRem(CARD_WIDTH_PX)};
	overflow-y: auto;
	padding: ${({ theme }): string => theme.sizes.padding.small} 0;
	border-radius: ${({ theme }): string => theme.borderRadius};
	background-color: ${({ theme }): string => theme.palette.gray6.regular};
	box-shadow: ${({ theme }): string => theme.shadows.regular};
`;

/** secondary.active rather than secondary: #828282 is below 4.5:1 on white at 12px. */
const CardTitle = styled(Text)`
	color: ${({ theme }): string => theme.palette.secondary.active};
`;

const CardRow = styled(Container)`
	min-height: 2rem;
`;

const HiddenTagsCount = ({
	tags
}: Readonly<{ tags: ReadonlyArray<TagPillItem> }>): React.JSX.Element => {
	const [t] = useTranslation();
	const anchorRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const [position, setPosition] = useState<CardPosition>();

	const close = useCallback((): void => {
		clearTimeout(timeoutRef.current);
		setPosition(undefined);
	}, []);
	const onAnchorEnter = useCallback((): void => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			if (anchorRef.current) {
				setPosition(cardPosition(anchorRef.current.getBoundingClientRect()));
			}
		}, HIDDEN_TAGS_CARD_DELAY_MS);
	}, []);
	// The card stays open while the pointer moves from "+N" into it, and back.
	const onLeave = useCallback(
		(event: React.MouseEvent): void => {
			const to = event.relatedTarget;
			const inside = (el: HTMLElement | null): boolean => to instanceof Node && !!el?.contains(to);
			if (!inside(anchorRef.current) && !inside(cardRef.current)) {
				close();
			}
		},
		[close]
	);

	const open = position !== undefined;
	// Esc closes it; so do a scroll outside it and a resize, since the card is fixed and "+N" moves.
	useEffect(() => {
		if (!open) {
			return undefined;
		}
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				close();
			}
		};
		const onScroll = (event: Event): void => {
			if (!(event.target instanceof Node && cardRef.current?.contains(event.target))) {
				close();
			}
		};
		document.addEventListener('keydown', onKeyDown);
		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', close);
		return (): void => {
			document.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', close);
		};
	}, [open, close]);
	useEffect(() => (): void => clearTimeout(timeoutRef.current), []);

	return (
		<>
			<Counter
				ref={anchorRef}
				size="extrasmall"
				data-testid="hidden-tags-count"
				onMouseEnter={onAnchorEnter}
				onMouseLeave={onLeave}
			>
				+{tags.length}
			</Counter>
			{position && (
				<Portal show>
					<Card
						ref={cardRef}
						onMouseLeave={onLeave}
						data-testid="hidden-tags-card"
						aria-hidden
						style={position}
					>
						<Container
							padding={{ top: 'extrasmall', bottom: 'small', horizontal: 'medium' }}
							crossAlignment="flex-start"
						>
							<CardTitle size="extrasmall">
								{t('label.more_tags', {
									count: tags.length,
									defaultValue_one: '{{count}} more tag',
									defaultValue: '{{count}} more tags'
								})}
							</CardTitle>
						</Container>
						{tags.map((tag) => (
							<CardRow
								key={tag.id}
								orientation="horizontal"
								mainAlignment="flex-start"
								gap="0.5rem"
								padding={{ left: 'medium', right: 'small' }}
							>
								{tag.shared ? (
									<Icon icon="PeopleOutline" size="small" color="text" />
								) : (
									tag.color && <TagDot color={tag.color} />
								)}
								<Text size="small">{tag.name}</Text>
							</CardRow>
						))}
					</Card>
				</Portal>
			)}
		</>
	);
};

export type ListTagPillsProps = {
	/** In display order (see `sortTagsByName`; shared tags last). */
	tags: ReadonlyArray<TagPillItem>;
	/** Width of the line the tags share with the subject (or the sender), in px. */
	lineWidth: number;
	/** Most px the tags may take: 200 on the subject line, 160 on a conversation child row. */
	maxBudget?: number;
};

/**
 * The tags of a list row: pills while they fit in 40% of the line, then "+N" as plain text whose
 * hover card lists the others; two dots at most on a line too narrow for a pill. Read-only and
 * pointer-only: the row's accessible name lists the tags.
 */
export const ListTagPills = memo(function ListTagPills({
	tags,
	lineWidth,
	maxBudget = TAG_PILLS_MAX_BUDGET
}: Readonly<ListTagPillsProps>): React.JSX.Element | null {
	const pillWidths = useMemo(() => tags.map(pillWidth), [tags]);
	const fit = fitTagPills({ lineWidth, pillWidths, counterWidth, maxBudget });

	if (tags.length === 0) {
		return null;
	}
	const visible = tags.slice(0, fit.visibleCount);
	const hidden = tags.slice(fit.visibleCount);

	return (
		<Container
			orientation="horizontal"
			width="fit"
			mainAlignment="flex-start"
			gap={fit.mode === 'dots' ? '0.1875rem' : pxToRem(LIST_TAG_PILLS_GAP)}
			style={{ flex: 'none', minWidth: 0 }}
		>
			{visible.map((tag, index) =>
				fit.mode === 'dots' ? (
					<Tooltip key={tag.id} label={tag.tooltip ?? tag.name}>
						<span>
							<TagDot color={tag.color ?? 'transparent'} />
						</span>
					</Tooltip>
				) : (
					<TagPill
						key={tag.id}
						name={tag.name}
						color={tag.color}
						shared={tag.shared}
						tooltip={tag.tooltip}
						maxWidth={index === 0 ? pxToRem(fit.firstPillMaxWidth) : undefined}
					/>
				)
			)}
			{hidden.length > 0 && <HiddenTagsCount tags={hidden} />}
		</Container>
	);
});
