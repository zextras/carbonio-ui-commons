/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { generateFolder } from '../../../../test/mocks/folders/folders-generator';
import { makeListItemsVisible, screen, setupTest } from '../../../../test/test-setup';
import { Folder } from '../../../../types';
import { FlatFolders } from '../flat-folders';

describe('flattenFolders', () => {
	it('should include only children matching the search criteria (case-insensitive)', async () => {
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
				searchString={'trash'}
				onFolderSelected={jest.fn()}
				allowRootSelection={false}
			/>
		);

		expect(await screen.findByTestId(`folder-flat-root-${root.id}`)).toBeVisible();
		makeListItemsVisible();
		expect(await screen.findByTestId(`folder-flat-item-trash`)).toBeVisible();
		expect(screen.queryByTestId(`folder-flat-item-inbox`)).not.toBeInTheDocument();
	});

	it('should include only children matching the search criteria and filter condition', async () => {
		const root = generateFolder({
			id: '1',
			children: [
				generateFolder({ id: 'TRASH', name: 'TRASH', children: [] }),
				generateFolder({ id: 'trash', name: 'trash', children: [] })
			]
		});
		setupTest(
			<FlatFolders
				rootFolders={[root]}
				searchString={'trash'}
				onFolderSelected={jest.fn()}
				filterChildren={(folder: Folder): boolean => folder.name === 'trash'}
				allowRootSelection={false}
			/>
		);

		expect(await screen.findByTestId(`folder-flat-root-${root.id}`)).toBeVisible();
		makeListItemsVisible();
		expect(await screen.findByTestId(`folder-flat-item-trash`)).toBeVisible();
		expect(screen.queryByTestId(`folder-flat-item-TRASH`)).not.toBeInTheDocument();
	});

	it('should prevent click on root folders when allowRootSelection is false', async () => {
		const root = generateFolder({
			id: '1',
			children: []
		});
		const onSelect = jest.fn();

		const { user } = setupTest(
			<FlatFolders
				rootFolders={[root]}
				searchString={'trash'}
				onFolderSelected={onSelect}
				allowRootSelection={false}
			/>
		);

		const rootFlatItem = await screen.findByTestId(`folder-flat-root-${root.id}`);
		await user.click(rootFlatItem);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('should call onFolderSelected when clicking a root folder and allowRootSelection is true', async () => {
		const root = generateFolder({
			id: '1',
			children: []
		});
		const onSelect = jest.fn();

		const { user } = setupTest(
			<FlatFolders
				rootFolders={[root]}
				searchString={'trash'}
				onFolderSelected={onSelect}
				allowRootSelection
			/>
		);

		const rootFlatItem = await screen.findByTestId(`folder-flat-root-${root.id}`);
		await user.click(rootFlatItem);
		expect(onSelect).toHaveBeenCalledWith(root);
	});
});
