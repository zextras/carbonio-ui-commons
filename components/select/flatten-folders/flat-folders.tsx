/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useMemo } from 'react';

import { Container, Padding, Row, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { FlatRoot } from './flat-root';
import { flattenAndFilterFoldersWithCap, getSystemFolderTranslatedName } from './utils';
import { Folder } from '../../../types';

type FlatFoldersProps = {
	folders: Array<Folder>;
	searchString: string;
	selectedFolderId?: string;
	onFolderSelected?: (folder: Folder) => void;
	allowRootSelection?: boolean;
};

export const FlatFolders = ({
	folders,
	searchString,
	onFolderSelected,
	selectedFolderId,
	allowRootSelection
}: FlatFoldersProps): React.JSX.Element => {
	const [hasMoreResults, setHasMoreResults] = React.useState(false);
	const [t] = useTranslation();
	const flatFilteredFolders = useMemo(() => {
		let remaining = 100;

		return folders
			.map((folder) => {
				if (remaining <= 0) {
					return { ...folder, children: [] };
				}

				const currentFolder = {
					...folder,
					name: getSystemFolderTranslatedName({ folderName: folder.name }),
					children: []
				};
				const children = flattenAndFilterFoldersWithCap(folder.children, searchString, remaining);
				remaining -= children.length;
				if (remaining <= 0) {
					setHasMoreResults(true);
				} else {
					setHasMoreResults(false);
				}

				return { ...currentFolder, children };
			})
			.filter((folder): folder is Folder => folder !== null);
	}, [folders, searchString]);

	const hasMoreResultsWarningLabel = t(
		'modal.messageFilteringList',
		'Only the first 100 results are displayed. Narrow your search criteria to view the complete list.'
	);

	return (
		<>
			{hasMoreResults && (
				<Padding top="small" bottom="large">
					<Row wrap="nowrap" takeAvailableSpace width="fill">
						<Text data-testid={'has-more-results'} textAlign="left" size="small">
							{hasMoreResultsWarningLabel}
						</Text>
					</Row>
				</Padding>
			)}
			{!hasMoreResults && <Padding vertical="medium" />}
			<Container orientation={'vertical'} style={{ overflowY: 'auto' }}>
				{flatFilteredFolders.map<ReactElement>((folder) => (
					<FlatRoot
						key={folder.id}
						folder={folder}
						childrenFolders={folder.children}
						isOpen
						onFolderSelected={onFolderSelected}
						selectedFolderId={selectedFolderId}
						allowRootSelection={allowRootSelection}
					/>
				))}
			</Container>
		</>
	);
};
