/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ChangeEvent, ReactElement, useMemo, useState } from 'react';

import { ThemeProvider } from '@mui/material';
import { Button, Container, Input, Padding } from '@zextras/carbonio-design-system';
import { t } from '@zextras/carbonio-shell-ui';

import { FlatFolders } from './flat-folders';
import { FolderAccordionCustomComponent } from './folder-accordions-custom-component';
import { FoldersAccordion } from './folders-accordion';
import { useFolders } from './hooks';
import { FOLDERS } from '../../../constants/folders';
import { getFolder } from '../../../store/zustand/folder';
import { themeMui } from '../../../theme/theme-mui';
import { Folder } from '../../../types';

export type FolderSelectorProps = {
	inputLabel?: string;
	onNewFolderClick?: () => void;
	selectedFolderId?: string;
	onFolderSelected: (arg: Folder) => void;
	showSharedAccounts: boolean;
	allowRootSelection: boolean;
	filterChildren?: (folder: Folder) => boolean;
};

export const FolderSelector = ({
	inputLabel,
	onNewFolderClick,
	selectedFolderId,
	onFolderSelected,
	allowRootSelection,
	showSharedAccounts,
	filterChildren
}: FolderSelectorProps): ReactElement => {
	const [inputValue, setInputValue] = useState('');
	const selectedFolder = selectedFolderId && getFolder(selectedFolderId);
	const folders = useFolders();
	const rootFolders = useMemo<Array<Folder>>(
		() => (showSharedAccounts ? folders : folders.filter((root) => root.id === FOLDERS.USER_ROOT)),
		[folders, showSharedAccounts]
	);
	const disabledFolderIdsSelection = allowRootSelection
		? []
		: rootFolders.map((folder) => folder.id);

	const inputName = selectedFolder ? selectedFolder.name : '';
	return (
		<>
			<Input
				data-testid={'folder-name-filter'}
				inputName={inputName}
				label={inputLabel ?? t('label.filter_folders', 'Filter folders')}
				backgroundColor="gray5"
				value={inputValue}
				onChange={(e: ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
			/>
			<Container
				style={{ overflowY: 'auto', display: 'block' }}
				height="fit"
				width="fill"
				orientation="vertical"
				mainAlignment="flex-start"
				minHeight="30vh"
				maxHeight="60vh"
			>
				{inputValue.length > 0 ? (
					<FlatFolders
						rootFolders={rootFolders}
						searchString={inputValue}
						onFolderSelected={onFolderSelected}
						selectedFolderId={selectedFolderId}
						allowRootSelection={allowRootSelection}
						filterChildren={filterChildren}
					/>
				) : (
					<ThemeProvider theme={themeMui}>
						<Padding vertical="medium" />
						<FoldersAccordion
							folders={rootFolders}
							onFolderSelected={onFolderSelected}
							selectedFolderId={selectedFolderId}
							disabledFolderIds={disabledFolderIdsSelection}
							FolderAccordionCustomComponent={FolderAccordionCustomComponent}
							filterChildren={filterChildren}
						/>
					</ThemeProvider>
				)}
			</Container>
			{onNewFolderClick && (
				<Container
					padding={{ top: 'medium', bottom: 'medium' }}
					mainAlignment="center"
					crossAlignment="flex-start"
				>
					<Button
						type="ghost"
						label={t('label.new_folder', 'New Folder')}
						color="primary"
						onClick={onNewFolderClick}
					/>
				</Container>
			)}
		</>
	);
};
