/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { setupTest, screen } from '../../../../test/test-setup';
import { FolderSelector } from '../folder-selector';

describe('Folder Selector', () => {
	const onFolderSelected = jest.fn();
	it('should display the folders accordion when there is no filter in the search input', async () => {
		setupTest(
			<FolderSelector
				onFolderSelected={onFolderSelected}
				showSharedAccounts={false}
				allowRootSelection={false}
			/>
		);

		expect(await screen.findByTestId('accordion-folders-selector')).toBeVisible();
	});
	it('should display flatten folders when filtering folders from the input', async () => {
		const { user } = setupTest(
			<FolderSelector
				onFolderSelected={onFolderSelected}
				showSharedAccounts={false}
				allowRootSelection={false}
			/>
		);

		const filterFolderInput = await screen.findByTestId('folder-name-filter');
		await user.type(filterFolderInput, 'my-folder');
		expect(await screen.findByTestId('flat-folders-selector')).toBeVisible();
	});
});
