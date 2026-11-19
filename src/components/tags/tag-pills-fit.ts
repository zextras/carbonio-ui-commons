/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/** Share of the line the tags may take: the subject (or sender) keeps at least 60%. */
export const TAG_PILLS_BUDGET_RATIO = 0.4;
/** Most the tags may take on a list row's subject line. */
export const TAG_PILLS_MAX_BUDGET = 200;
/** Most the tags may take on a conversation child row, after the date. */
export const TAG_PILLS_CHILD_ROW_MAX_BUDGET = 160;
/** The first pill is always shown, truncated at this width. */
export const FIRST_TAG_PILL_MAX_WIDTH = 160;
/** Below this, the first pill can't show a readable name: dots instead. */
export const FIRST_TAG_PILL_MIN_WIDTH = 64;
/** At most this many dots on a line too narrow for pills. */
export const MAX_TAG_DOTS = 2;
/** Space between pills, and between the last pill and "+N", in a list row. */
export const LIST_TAG_PILLS_GAP = 8;

export type TagPillsFit =
	| { mode: 'pills'; visibleCount: number; hiddenCount: number; firstPillMaxWidth: number }
	| { mode: 'dots'; visibleCount: number; hiddenCount: number };

export type FitTagPillsArgs = {
	/** Width of the whole line the tags share with the subject (or the sender), in px. */
	lineWidth: number;
	/** Natural width of each pill, in display order, in px. */
	pillWidths: ReadonlyArray<number>;
	/** Width of the "+N" text for a given number of hidden tags, in px. */
	counterWidth: (hiddenCount: number) => number;
	maxBudget?: number;
	gap?: number;
};

/**
 * How many tags a list row shows: pills in order while they fit in 40% of the line (at most
 * `maxBudget`), keeping room for "+N" while some are left out. The first pill is always shown; on a
 * line too narrow to give it 64px, at most two dots instead.
 */
export const fitTagPills = ({
	lineWidth,
	pillWidths,
	counterWidth,
	maxBudget = TAG_PILLS_MAX_BUDGET,
	gap = LIST_TAG_PILLS_GAP
}: FitTagPillsArgs): TagPillsFit => {
	const total = pillWidths.length;
	const budget = Math.min(lineWidth * TAG_PILLS_BUDGET_RATIO, maxBudget);

	if (total > 0 && budget < FIRST_TAG_PILL_MIN_WIDTH) {
		const visibleCount = Math.min(MAX_TAG_DOTS, total);
		return { mode: 'dots', visibleCount, hiddenCount: total - visibleCount };
	}

	const counterSpace = (hiddenCount: number): number =>
		hiddenCount > 0 ? gap + counterWidth(hiddenCount) : 0;

	const firstPillMaxWidth = Math.max(
		FIRST_TAG_PILL_MIN_WIDTH,
		Math.min(FIRST_TAG_PILL_MAX_WIDTH, budget - counterSpace(total - 1))
	);
	if (total === 0) {
		return { mode: 'pills', visibleCount: 0, hiddenCount: 0, firstPillMaxWidth };
	}

	let used = Math.min(pillWidths[0], firstPillMaxWidth);
	let visibleCount = 1;
	while (visibleCount < total) {
		const next = used + gap + pillWidths[visibleCount];
		if (next + counterSpace(total - visibleCount - 1) > budget) {
			break;
		}
		used = next;
		visibleCount += 1;
	}
	return { mode: 'pills', visibleCount, hiddenCount: total - visibleCount, firstPillMaxWidth };
};
