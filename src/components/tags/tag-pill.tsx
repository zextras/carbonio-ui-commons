/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { forwardRef, MouseEvent, Ref } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { getTagPillColors } from '../../helpers/tags';

/** Outline of the dot and of a shared-folder pill: ≥ 3:1 on white, whatever the tag colour. */
export const TAG_OUTLINE_COLOR = '#767676';

export type TagPillSize = 'small' | 'medium';

/** Room the "×" takes when it shows: the pill grows by this, to the right. */
const REMOVE_SLOT_WIDTH = '1.125rem';
/** The shown "×" sits over the name's right padding; at rest the padding stays whole. */
const REMOVE_SLOT_OVERLAP = '-0.375rem';

/** small: list rows; medium: reading pane. */
const PILL_SIZES: Record<
	TagPillSize,
	{ height: string; paddingLeft: string; paddingRight: string; fontSize: string }
> = {
	small: {
		height: '1.25rem',
		paddingLeft: '0.375rem',
		paddingRight: '0.5rem',
		fontSize: '0.75rem'
	},
	medium: {
		height: '1.5rem',
		paddingLeft: '0.5rem',
		paddingRight: '0.625rem',
		fontSize: '0.8125rem'
	}
};

const Dot = styled.span<{ $color: string }>`
	display: inline-block;
	flex: none;
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	background-color: ${({ $color }): string => $color};
	box-shadow: 0 0 0 1px ${TAG_OUTLINE_COLOR};
`;

/** A tag's colour as an outlined dot: inside a pill, or alone where a pill does not fit. */
export const TagDot = ({ color }: Readonly<{ color: string }>): React.JSX.Element => (
	<Dot data-testid="tag-dot" $color={color} />
);

/** What marks a tag before its name: the shared icon for a tag from a shared folder, else its dot. */
export const TagMark = ({
	shared,
	color
}: Readonly<{ shared?: boolean; color?: string }>): React.JSX.Element | null => {
	if (shared) {
		return <Icon icon="PeopleOutline" size="small" color="text" />;
	}
	return color ? <TagDot color={color} /> : null;
};

const PillRoot = styled.span<{
	$size: TagPillSize;
	$background: string;
	$hoverBackground: string;
	$border: string | undefined;
	$maxWidth: string | undefined;
}>`
	position: relative;
	display: inline-flex;
	align-items: center;
	flex: none;
	min-width: 0;
	max-width: ${({ $maxWidth }): string => $maxWidth ?? 'none'};
	height: ${({ $size }): string => PILL_SIZES[$size].height};
	border-radius: ${({ $size }): string => `calc(${PILL_SIZES[$size].height} / 2)`};
	background-color: ${({ $background }): string => $background};
	border: ${({ $border }): string => ($border ? `1px solid ${$border}` : 'none')};
	box-sizing: border-box;
	color: ${({ theme }): string => theme.palette.text.regular};

	&:hover,
	&:focus-within {
		background-color: ${({ $hoverBackground }): string => $hoverBackground};
	}

	/* Attribute selectors rather than emotion component selectors: this library is compiled with
	   tsc, without the babel plugin component selectors require. */
	&:hover [data-remove-slot],
	&:focus-within [data-remove-slot] {
		width: ${REMOVE_SLOT_WIDTH};
		margin-left: ${REMOVE_SLOT_OVERLAP};
		opacity: 1;
		overflow: visible;
		pointer-events: auto;
		transition:
			width 160ms ease-out,
			margin-left 160ms ease-out,
			opacity 160ms ease-out;
	}

	&:hover [data-remove-slot] button,
	&:focus-within [data-remove-slot] button {
		transform: translateY(-50%) scale(1);
		transition: transform 160ms ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		&:hover [data-remove-slot],
		&:focus-within [data-remove-slot],
		&:hover [data-remove-slot] button,
		&:focus-within [data-remove-slot] button {
			transition: none;
		}
	}
`;

const pillContent = (size: TagPillSize): ReturnType<typeof css> => css`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	min-width: 0;
	height: 100%;
	padding: 0 ${PILL_SIZES[size].paddingRight} 0 ${PILL_SIZES[size].paddingLeft};
`;

const PillContent = styled.span<{ $size: TagPillSize }>`
	${({ $size }): ReturnType<typeof css> => pillContent($size)}
`;

const PillButton = styled.button<{ $size: TagPillSize }>`
	${({ $size }): ReturnType<typeof css> => pillContent($size)}
	border: none;
	border-radius: inherit;
	background: transparent;
	color: inherit;
	font: inherit;
	cursor: pointer;
`;

const PillLabel = styled(Text, {
	shouldForwardProp: (prop) => prop !== '$size'
})<{ $size: TagPillSize }>`
	font-size: ${({ $size }): string => PILL_SIZES[$size].fontSize};
	font-weight: normal;
	color: inherit;
`;

/**
 * The "×" slot: hidden until the pill is hovered or focused, then the pill widens by
 * `REMOVE_SLOT_WIDTH` (160ms ease-out) while the "×" fades in from scale 0.6. On the way out the "×"
 * fades first, then the pill narrows (120ms ease-in). Always shown where there is no hover (touch)
 * and without the animation when the user asks for reduced motion.
 */
const RemoveSlot = styled.span`
	position: relative;
	display: inline-flex;
	align-items: center;
	flex: none;
	align-self: stretch;
	width: 0;
	opacity: 0;
	overflow: hidden;
	transition:
		opacity 60ms ease-in,
		width 120ms ease-in 60ms,
		margin-left 120ms ease-in 60ms;

	@media (hover: none) {
		width: ${REMOVE_SLOT_WIDTH};
		margin-left: ${REMOVE_SLOT_OVERLAP};
		opacity: 1;
		overflow: visible;
	}

	@media (prefers-reduced-motion: reduce) {
		width: ${REMOVE_SLOT_WIDTH};
		margin-left: ${REMOVE_SLOT_OVERLAP};
		transition: none;
	}

	/* With reduced motion it keeps its width over the end of the pill: hidden, it must take no clicks */
	@media (prefers-reduced-motion: reduce) and (hover: hover) {
		pointer-events: none;
	}
`;

/** 24×24 target, centred on the 14px icon even though the slot is narrower. */
const RemoveButton = styled.button`
	position: absolute;
	top: 50%;
	left: -0.3125rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	border: none;
	border-radius: 50%;
	background: transparent;
	color: inherit;
	cursor: pointer;
	transform: translateY(-50%) scale(0.6);
	transition: transform 120ms ease-in;

	@media (hover: none) {
		transform: translateY(-50%) scale(1);
	}

	@media (prefers-reduced-motion: reduce) {
		transform: translateY(-50%) scale(1);
		transition: none;
	}
`;

export type TagPillProps = {
	name: string;
	/** Tag colour as hex (see `resolveTagColorHex`). Ignored for `shared` pills. */
	color?: string;
	size?: TagPillSize;
	/** The name is truncated with an ellipsis past this width (full name in a tooltip). */
	maxWidth?: string;
	/**
	 * A tag set by the owner of a shared folder: outlined, shared icon, no colour; it can be neither
	 * clicked nor removed.
	 */
	shared?: boolean;
	/** Shown on hover instead of the name, e.g. whose folder a shared tag comes from. Translated. */
	tooltip?: string;
	/** Makes the pill a button, e.g. to search by the tag. */
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	/** Adds the "×" button after the name. */
	onRemove?: () => void;
	/** Accessible name of the "×". Default: "Remove tag {name}". Translated. */
	removeLabel?: string;
	/** Ref of the "×", to move focus to it. */
	removeButtonRef?: Ref<HTMLButtonElement>;
};

/**
 * A tag as a pill: colour dot + name on a tint of the tag colour. Text is always #333, so the
 * colour is never the only thing that tells tags apart.
 */
export const TagPill = forwardRef<HTMLButtonElement, Readonly<TagPillProps>>(function TagPill(
	{
		name,
		color,
		size = 'small',
		maxWidth,
		shared = false,
		tooltip,
		onClick,
		onRemove,
		removeLabel,
		removeButtonRef
	},
	ref
) {
	const [t] = useTranslation();
	const colors = !shared && color ? getTagPillColors(color) : undefined;
	const clickable = !shared && onClick !== undefined;
	const removable = !shared && onRemove !== undefined;

	const label = (
		<Tooltip label={tooltip ?? name} overflowTooltip={tooltip === undefined}>
			<PillLabel $size={size} overflow="ellipsis">
				{name}
			</PillLabel>
		</Tooltip>
	);
	const content = (
		<>
			<TagMark shared={shared} color={color} />
			{label}
		</>
	);

	return (
		<PillRoot
			data-testid="tag-pill"
			$size={size}
			$background={colors?.background ?? 'transparent'}
			$hoverBackground={colors?.hoverBackground ?? 'transparent'}
			$border={shared ? TAG_OUTLINE_COLOR : colors?.border}
			$maxWidth={maxWidth}
		>
			{clickable ? (
				<PillButton type="button" ref={ref} $size={size} onClick={onClick}>
					{content}
				</PillButton>
			) : (
				<PillContent $size={size}>{content}</PillContent>
			)}
			{removable && (
				<RemoveSlot data-remove-slot="">
					<Tooltip label={t('label.remove_tag', 'Remove tag')}>
						<RemoveButton
							type="button"
							ref={removeButtonRef}
							aria-label={
								removeLabel ??
								t('label.remove_tag_name', {
									name,
									defaultValue: 'Remove tag {{name}}'
								})
							}
							onClick={onRemove}
						>
							<Icon icon="Close" size="small" color="text" />
						</RemoveButton>
					</Tooltip>
				</RemoveSlot>
			)}
		</PillRoot>
	);
});
