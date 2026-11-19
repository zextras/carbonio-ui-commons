/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { fitTagPills } from '../tag-pills-fit';

const counterWidth = (): number => 20;

describe('fitTagPills', () => {
	test('shows nothing when there are no tags', () => {
		expect(fitTagPills({ lineWidth: 500, pillWidths: [], counterWidth })).toEqual({
			mode: 'pills',
			visibleCount: 0,
			hiddenCount: 0,
			firstPillMaxWidth: 160
		});
	});

	test('shows every pill when they fit in 40% of the line', () => {
		expect(fitTagPills({ lineWidth: 500, pillWidths: [50, 60], counterWidth })).toMatchObject({
			mode: 'pills',
			visibleCount: 2,
			hiddenCount: 0
		});
	});

	test('never uses more than 200px, however wide the line', () => {
		// 60 + 8 + 60 + 8 + 60 = 196 fits in 200, the fourth pill does not
		expect(
			fitTagPills({ lineWidth: 2000, pillWidths: [60, 60, 60, 60], counterWidth })
		).toMatchObject({ visibleCount: 2, hiddenCount: 2 });
	});

	test('keeps room for "+N" while other tags remain', () => {
		// a third pill would reach 196 + 8 + 20 (the "+1") = 224 > 200
		expect(
			fitTagPills({ lineWidth: 500, pillWidths: [60, 60, 60, 60], counterWidth })
		).toMatchObject({ visibleCount: 2, hiddenCount: 2 });
	});

	test('the last pill needs no room for "+N"', () => {
		expect(fitTagPills({ lineWidth: 500, pillWidths: [60, 60, 60], counterWidth })).toMatchObject({
			visibleCount: 3,
			hiddenCount: 0
		});
	});

	test('always shows the first pill, truncated at 160px', () => {
		expect(fitTagPills({ lineWidth: 500, pillWidths: [300, 50], counterWidth })).toEqual({
			mode: 'pills',
			visibleCount: 1,
			hiddenCount: 1,
			firstPillMaxWidth: 160
		});
	});

	test('gives the first pill at least 64px when the budget is tight', () => {
		// budget 68: 68 - 8 - 20 leaves 40 for the first pill, raised to 64
		expect(fitTagPills({ lineWidth: 170, pillWidths: [100, 50], counterWidth })).toEqual({
			mode: 'pills',
			visibleCount: 1,
			hiddenCount: 1,
			firstPillMaxWidth: 64
		});
	});

	test('switches to at most two dots when the line is narrower than 160px', () => {
		expect(fitTagPills({ lineWidth: 150, pillWidths: [40, 40, 40, 40, 40], counterWidth })).toEqual(
			{ mode: 'dots', visibleCount: 2, hiddenCount: 3 }
		);
		expect(fitTagPills({ lineWidth: 150, pillWidths: [40], counterWidth })).toEqual({
			mode: 'dots',
			visibleCount: 1,
			hiddenCount: 0
		});
	});

	test('uses the budget given by the caller, e.g. 160px in conversation child rows', () => {
		expect(
			fitTagPills({ lineWidth: 1000, maxBudget: 160, pillWidths: [60, 60, 60], counterWidth })
		).toMatchObject({ visibleCount: 2, hiddenCount: 1 });
	});
});
