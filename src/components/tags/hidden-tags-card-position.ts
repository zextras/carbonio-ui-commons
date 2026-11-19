/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const CARD_WIDTH_PX = 200;
const CARD_OFFSET_PX = 4;
const VIEWPORT_MARGIN_PX = 8;

export type CardPosition = { left: number; top?: number; bottom?: number; maxHeight: number };

/**
 * Below "+N", right-aligned with it; above it when "+N" is in the lower part of the window. Never
 * taller than the room on that side: a long list scrolls inside the card.
 */
export const cardPosition = (anchor: DOMRect): CardPosition => {
	const left = Math.max(VIEWPORT_MARGIN_PX, anchor.right - CARD_WIDTH_PX);
	if (anchor.bottom > window.innerHeight * 0.6) {
		const bottom = window.innerHeight - anchor.top + CARD_OFFSET_PX;
		return { left, bottom, maxHeight: window.innerHeight - bottom - VIEWPORT_MARGIN_PX };
	}
	const top = anchor.bottom + CARD_OFFSET_PX;
	return { left, top, maxHeight: window.innerHeight - top - VIEWPORT_MARGIN_PX };
};
