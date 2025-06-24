/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { within } from '@testing-library/react';

import { generateFolder } from '../../../../__test__/mocks/folders/folders-generator';
import { setupTest, screen } from '../../../../__test__/test-setup';
import { Folder } from '../../../../types';
import { FolderAccordionCustomComponent } from '../folder-accordions-custom-component';
import { FoldersAccordion } from '../folders-accordion';

describe('FlattenFoldersAccordion', () => {
	const root1Child1 = generateFolder({ id: 'root-1-child-1', children: [] });
	const root1Child2 = generateFolder({ id: 'root-1-child-2', children: [] });
	const rootFolder1 = generateFolder({
		id: '1',
		children: [root1Child1, root1Child2]
	});

	const root2Child1 = generateFolder({ id: 'root-2-child-1', children: [] });
	const rootFolder2 = generateFolder({ id: '2', children: [root2Child1] });
	const onFolderSelected = jest.fn();

	it('should render all root folders', async () => {
		setupTest(
			<FoldersAccordion
				folders={[rootFolder1, rootFolder2]}
				onFolderSelected={onFolderSelected}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);

		expect(await screen.findByTestId(`folder-accordion-item-${rootFolder1.id}`)).toBeVisible();
		expect(await screen.findByTestId(`folder-accordion-item-${rootFolder2.id}`)).toBeVisible();
	});

	it('should render children of first folder initially', async () => {
		setupTest(
			<FoldersAccordion
				folders={[rootFolder1, rootFolder2]}
				onFolderSelected={onFolderSelected}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);
		expect(screen.getByTestId(`folder-accordion-item-${root1Child1.id}`)).toBeVisible();
		expect(screen.getByTestId(`folder-accordion-item-${root1Child2.id}`)).toBeVisible();
		expect(screen.queryByTestId(`folder-accordion-item-${root2Child1.id}`)).not.toBeInTheDocument();
	});

	it('should render children of expanded folder', async () => {
		const { user } = setupTest(
			<FoldersAccordion
				folders={[rootFolder1, rootFolder2]}
				onFolderSelected={onFolderSelected}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);

		const accordionItemRoot2 = await screen.findByTestId(`folder-accordion-item-${rootFolder2.id}`);

		await user.click(await within(accordionItemRoot2).findByTestId('ExpandMoreIcon'));
		expect(await screen.findByTestId(`folder-accordion-item-${root2Child1.id}`)).toBeVisible();
	});

	it('should include only children with matching filter condition', async () => {
		const root = generateFolder({
			id: '1',
			children: [
				generateFolder({ id: 'trash', name: 'Trash', children: [] }),
				generateFolder({ id: 'inbox', name: 'Inbox', children: [] })
			]
		});
		setupTest(
			<FoldersAccordion
				folders={[root]}
				onFolderSelected={onFolderSelected}
				filterChildren={(folder: Folder): boolean => folder.name === 'Trash'}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);

		expect(await screen.findByTestId(`folder-accordion-item-${root.id}`)).toBeVisible();
		expect(await screen.findByTestId(`folder-accordion-item-trash`)).toBeVisible();
		expect(screen.queryByTestId(`folder-accordion-item-inbox`)).not.toBeInTheDocument();
	});

	it('should prevent click on disabled folder ids', async () => {
		const root = generateFolder({
			id: '1',
			children: []
		});
		const onSelect = jest.fn();

		const { user } = setupTest(
			<FoldersAccordion
				folders={[root]}
				onFolderSelected={onFolderSelected}
				disabledFolderIds={[root.id]}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);

		const rootAccordion = await screen.findByTestId(`folder-accordion-item-${root.id}`);
		await user.click(rootAccordion);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('should call onFolderSelected with the given Folder when clicking a folder', async () => {
		const root = generateFolder({
			id: '1',
			children: []
		});
		const onSelect = jest.fn();

		const { user } = setupTest(
			<FoldersAccordion
				folders={[root]}
				onFolderSelected={onSelect}
				FolderAccordionCustomComponent={FolderAccordionCustomComponent}
			/>
		);

		const rootAccordion = await screen.findByTestId(`folder-accordion-item-${root.id}`);
		await user.click(rootAccordion);
		expect(onSelect).toHaveBeenCalledWith(root);
	});
});
