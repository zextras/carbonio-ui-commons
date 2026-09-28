/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen, setupTest } from '../../../__test__/test-setup';
import { ZIMBRA_STANDARD_COLORS } from '../../../constants/utils';
import { FolderColorPicker } from '../folder-color-picker';

describe('FolderColorPicker', () => {
	test('renders a dot for each standard folder color', () => {
		setupTest(<FolderColorPicker value={ZIMBRA_STANDARD_COLORS[0].hex} onChange={vi.fn()} />);

		ZIMBRA_STANDARD_COLORS.forEach((color) => {
			expect(screen.getByRole('button', { name: color.zLabel })).toBeVisible();
		});
	});

	test('calls onChange with the hex of the clicked standard color', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<FolderColorPicker value={ZIMBRA_STANDARD_COLORS[0].hex} onChange={onChange} />
		);

		await user.click(screen.getByRole('button', { name: ZIMBRA_STANDARD_COLORS[5].zLabel }));

		expect(onChange).toHaveBeenCalledWith(ZIMBRA_STANDARD_COLORS[5].hex);
	});

	test('forwards the caption', () => {
		setupTest(
			<FolderColorPicker
				value={ZIMBRA_STANDARD_COLORS[0].hex}
				onChange={vi.fn()}
				caption="folder caption"
			/>
		);

		expect(screen.getByText('folder caption')).toBeVisible();
	});
});
