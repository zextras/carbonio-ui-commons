/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { generateFolder } from '../../../../test/mocks/folders/folders-generator';
import { makeListItemsVisible, screen, setupTest } from '../../../../test/test-setup';
import { FlatFolders } from '../flat-folders';

describe('flattenFolders', () => {
	it('should include only children matching the search criteria', async () => {
		const root = generateFolder({
			id: '1',
			children: [
				generateFolder({ id: 'trash', name: 'Trash', children: [] }),
				generateFolder({ id: 'inbox', name: 'Inbox', children: [] })
			]
		});
		setupTest(
			<FlatFolders
				rootFolders={[root]}
				searchString={'Trash'}
				onFolderSelected={jest.fn()}
				allowRootSelection={false}
			/>
		);

		expect(await screen.findByTestId(`folder-flat-root-${root.id}`)).toBeVisible();
		makeListItemsVisible();
		expect(await screen.findByTestId(`folder-flat-item-trash`)).toBeVisible();
		expect(screen.queryByTestId(`folder-flat-item-inbox`)).not.toBeInTheDocument();
	});
});
