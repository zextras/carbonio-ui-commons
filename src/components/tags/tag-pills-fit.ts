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
/**
 * Below this a pill can't show a readable name: the first pill never gets less, the last one is
 * truncated only down to this, and a line whose budget is smaller shows icon-only pills.
 */
export const TAG_PILL_MIN_WIDTH = 64;
/** Width (and height) of an icon-only pill. */
export const ICON_TAG_PILL_SIZE = 20;
/** Space between the tags, and between the last tag and "+N", in a list row. */
export const LIST_TAG_PILLS_GAP = 4;

/** How a tag is shown: a pill with its name (truncated past `maxWidth`), or an icon-only pill. */
export type TagPillSlot = { kind: 'pill'; maxWidth?: number } | { kind: 'icon' };

export type TagPillsFit = {
	/** One per tag shown, in display order. */
	slots: ReadonlyArray<TagPillSlot>;
	/** The tags after them, counted by "+N". */
	hiddenCount: number;
};

export type FitTagPillsArgs = {
	/** Width of the whole line the tags share with the subject (or the sender), in px. */
	lineWidth: number;
	/** Natural width of each pill, in display order, in px. */
	pillWidths: ReadonlyArray<number>;
	/** Width of the "+N" for a given number of hidden tags, in px. */
	counterWidth: (hiddenCount: number) => number;
	maxBudget?: number;
	gap?: number;
};

type FitState = { slots: Array<TagPillSlot>; used: number };

type FitContext = {
	total: number;
	budget: number;
	gap: number;
	counterSpace: (hiddenCount: number) => number;
};

/** Icon-only pills from `start` while they fit, keeping room for "+N" while tags remain. */
const fillWithIcons = (start: number, state: FitState, context: FitContext): TagPillsFit => {
	const { total, budget, gap, counterSpace } = context;
	let index = start;
	let { used } = state;
	while (index < total) {
		const next = used + (state.slots.length > 0 ? gap : 0) + ICON_TAG_PILL_SIZE;
		if (next + counterSpace(total - index - 1) > budget) {
			break;
		}
		used = next;
		state.slots.push({ kind: 'icon' });
		index += 1;
	}
	return { slots: state.slots, hiddenCount: total - index };
};

/** The first pill: at most 160px, leaving room for an icon and "+N" when more tags follow; 64px at least. */
const firstPillMaxWidth = ({ total, budget, gap, counterSpace }: FitContext): number => {
	const afterFirst = total > 1 ? gap + ICON_TAG_PILL_SIZE + counterSpace(total - 2) : 0;
	return Math.max(TAG_PILL_MIN_WIDTH, Math.min(FIRST_TAG_PILL_MAX_WIDTH, budget - afterFirst));
};

/**
 * How a list row shows its tags, in 40% of the line (at most `maxBudget`): pills in order while they
 * fit; when the next one doesn't, the last tag as a pill truncated to what is left (64px at least),
 * any other as icon-only pills while they fit, then "+N" for the rest. Room for "+N" is kept while
 * tags remain. The first pill is always shown, and leaves room for an icon when more tags follow.
 * A budget too small for a 64px pill shows icon-only pills only.
 */
export const fitTagPills = ({
	lineWidth,
	pillWidths,
	counterWidth,
	maxBudget = TAG_PILLS_MAX_BUDGET,
	gap = LIST_TAG_PILLS_GAP
}: FitTagPillsArgs): TagPillsFit => {
	const context: FitContext = {
		total: pillWidths.length,
		budget: Math.min(lineWidth * TAG_PILLS_BUDGET_RATIO, maxBudget),
		gap,
		counterSpace: (hiddenCount) => (hiddenCount > 0 ? gap + counterWidth(hiddenCount) : 0)
	};
	const { total, budget, counterSpace } = context;
	if (total === 0) {
		return { slots: [], hiddenCount: 0 };
	}
	if (budget < TAG_PILL_MIN_WIDTH) {
		return fillWithIcons(0, { slots: [], used: 0 }, context);
	}

	const firstMaxWidth = firstPillMaxWidth(context);
	const state: FitState = {
		slots: [{ kind: 'pill', maxWidth: firstMaxWidth }],
		used: Math.min(pillWidths[0], firstMaxWidth)
	};
	for (let index = 1; index < total; index += 1) {
		const next = state.used + gap + pillWidths[index];
		const left = budget - state.used - gap;
		if (next + counterSpace(total - index - 1) <= budget) {
			state.slots.push({ kind: 'pill' });
			state.used = next;
		} else if (index === total - 1 && left >= TAG_PILL_MIN_WIDTH) {
			state.slots.push({ kind: 'pill', maxWidth: left });
			return { slots: state.slots, hiddenCount: 0 };
		} else {
			return fillWithIcons(index, state, context);
		}
	}
	return { slots: state.slots, hiddenCount: 0 };
};
