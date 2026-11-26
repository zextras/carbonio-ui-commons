/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { fitTagPills, TagPillSlot } from '../tag-pills-fit';

/** "+N" with its 4px gap takes 24px, as an icon-only pill does. */
const counterWidth = (): number => 20;

const ICON: TagPillSlot = { kind: 'icon' };

const kinds = (slots: ReadonlyArray<TagPillSlot>): ReadonlyArray<TagPillSlot['kind']> =>
	slots.map((slot) => slot.kind);

describe('fitTagPills', () => {
	test('shows nothing when there are no tags', () => {
		expect(fitTagPills({ lineWidth: 500, pillWidths: [], counterWidth })).toEqual({
			slots: [],
			hiddenCount: 0
		});
	});

	test('shows every pill when they fit in 40% of the line', () => {
		const fit = fitTagPills({ lineWidth: 500, pillWidths: [50, 60], counterWidth });

		expect(kinds(fit.slots)).toEqual(['pill', 'pill']);
		expect(fit.hiddenCount).toBe(0);
	});

	test('keeps 4px between the tags', () => {
		// 96 + 4 + 100 = 200: both fit in the 200px budget, with 8px between them they would not
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [96, 100], counterWidth });

		expect(kinds(fit.slots)).toEqual(['pill', 'pill']);
	});

	test('a pill that fits is shown whole: only the first one has a maximum width', () => {
		const fit = fitTagPills({ lineWidth: 500, pillWidths: [50, 60], counterWidth });

		expect(fit.slots[1]).toEqual({ kind: 'pill' });
	});

	test('turns the tags after the last pill that fits into icon-only pills, then "+N"', () => {
		// 60 + 4 + 60 = 124; a third pill leaves no room for "+N". Icons of 20px, 4px apart: 148, 172;
		// a third icon would need 196 + 24 (the "+1") > 200
		const fit = fitTagPills({
			lineWidth: 2000,
			pillWidths: [60, 60, 60, 60, 60, 60],
			counterWidth
		});

		expect(kinds(fit.slots)).toEqual(['pill', 'pill', 'icon', 'icon']);
		expect(fit.hiddenCount).toBe(2);
	});

	test('the icons leave room for "+N" only while tags remain', () => {
		// 124 + 24 + 24 + 24 = 196: the third icon is the last tag, no "+N" after it
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [60, 60, 60, 60, 60], counterWidth });

		expect(kinds(fit.slots)).toEqual(['pill', 'pill', 'icon', 'icon', 'icon']);
		expect(fit.hiddenCount).toBe(0);
	});

	test('the last tag is a truncated pill when at least 64px are left for it', () => {
		// 100 + 4 = 104 used, 96 left for the last tag (120px)
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [100, 120], counterWidth });

		expect(fit.slots).toEqual([
			{ kind: 'pill', maxWidth: 160 },
			{ kind: 'pill', maxWidth: 96 }
		]);
		expect(fit.hiddenCount).toBe(0);
	});

	test('the last tag is an icon when less than 64px are left for it', () => {
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [140, 120], counterWidth });

		expect(kinds(fit.slots)).toEqual(['pill', 'icon']);
	});

	test('a tag that is not the last one is never truncated: it becomes an icon', () => {
		// 100 + 4 + 80 = 184, too much with "+1"; 96px are left, but another tag follows
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [100, 80, 60], counterWidth });

		expect(fit.slots.slice(1)).toEqual([ICON, ICON]);
		expect(fit.hiddenCount).toBe(0);
	});

	test('always shows the first pill, at most 160px wide', () => {
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [300], counterWidth });

		expect(fit.slots).toEqual([{ kind: 'pill', maxWidth: 160 }]);
	});

	test('the first pill leaves 24px for an icon when another tag follows', () => {
		// budget 120 (300 * 0.4): the first pill takes 120 - 24 = 96
		const fit = fitTagPills({ lineWidth: 300, pillWidths: [300, 60], counterWidth });

		expect(fit.slots).toEqual([{ kind: 'pill', maxWidth: 96 }, ICON]);
	});

	test('the first pill leaves room for an icon and "+N" when more tags follow', () => {
		// budget 200: the first pill takes 200 - 24 (icon) - 24 ("+2" and its gap) = 152
		const fit = fitTagPills({ lineWidth: 2000, pillWidths: [300, 60, 60, 60], counterWidth });

		expect(fit.slots).toEqual([{ kind: 'pill', maxWidth: 152 }, ICON]);
		expect(fit.hiddenCount).toBe(2);
	});

	test('gives the first pill at least 64px when the budget is tight', () => {
		// budget 68 (170 * 0.4): no room for 64px and an icon, the first pill keeps 64px
		const fit = fitTagPills({ lineWidth: 170, pillWidths: [300, 60, 60], counterWidth });

		expect(fit.slots).toEqual([{ kind: 'pill', maxWidth: 64 }]);
		expect(fit.hiddenCount).toBe(2);
	});

	test('on a line narrower than 160px shows only icon-only pills, then "+N"', () => {
		// budget 60 (150 * 0.4): 20 + 4 + 20 = 44 with no tag left; two icons and "+1" would need 68
		expect(
			kinds(fitTagPills({ lineWidth: 150, pillWidths: [60, 60], counterWidth }).slots)
		).toEqual(['icon', 'icon']);
		const fit = fitTagPills({ lineWidth: 150, pillWidths: [60, 60, 60, 60], counterWidth });
		expect(kinds(fit.slots)).toEqual(['icon']);
		expect(fit.hiddenCount).toBe(3);
	});

	test('on a very narrow line shows only "+N" when not even one icon fits with it', () => {
		const fit = fitTagPills({ lineWidth: 80, pillWidths: [60, 60], counterWidth });

		expect(fit.slots).toEqual([]);
		expect(fit.hiddenCount).toBe(2);
	});

	test('uses the budget given by the caller, e.g. 160px in conversation child rows', () => {
		// 60 + 4 + 60 = 124, + "+2" = 148; a third pill or an icon and "+1" would pass 160
		const fit = fitTagPills({
			lineWidth: 2000,
			pillWidths: [60, 60, 60, 60],
			counterWidth,
			maxBudget: 160
		});

		expect(kinds(fit.slots)).toEqual(['pill', 'pill']);
		expect(fit.hiddenCount).toBe(2);
	});
});
