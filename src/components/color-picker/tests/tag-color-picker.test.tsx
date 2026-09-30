/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen, setupTest } from '../../../__test__/test-setup';
import { ZIMBRA_STANDARD_COLORS } from '../../../constants/utils';
import { TagColorPicker } from '../tag-color-picker';

describe('TagColorPicker', () => {
	test('renders a dot for each standard color', () => {
		setupTest(<TagColorPicker value={ZIMBRA_STANDARD_COLORS[0].hex} onChange={vi.fn()} />);

		ZIMBRA_STANDARD_COLORS.forEach((color) => {
			expect(screen.getByRole('button', { name: color.zLabel })).toBeVisible();
		});
	});

	test('calls onChange with the hex of the clicked standard color', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<TagColorPicker value={ZIMBRA_STANDARD_COLORS[0].hex} onChange={onChange} />
		);

		await user.click(screen.getByRole('button', { name: ZIMBRA_STANDARD_COLORS[5].zLabel }));

		expect(onChange).toHaveBeenCalledWith(ZIMBRA_STANDARD_COLORS[5].hex);
	});

	test('shows the tag caption by default', () => {
		setupTest(<TagColorPicker value={ZIMBRA_STANDARD_COLORS[0].hex} onChange={vi.fn()} />);

		expect(screen.getByText('Choose a color to make this tag easier to recognize')).toBeVisible();
	});

	test('lets the caller override the caption', () => {
		setupTest(
			<TagColorPicker
				value={ZIMBRA_STANDARD_COLORS[0].hex}
				onChange={vi.fn()}
				caption="custom caption"
			/>
		);

		expect(screen.getByText('custom caption')).toBeVisible();
		expect(
			screen.queryByText('Choose a color to make this tag easier to recognize')
		).not.toBeInTheDocument();
	});
});
