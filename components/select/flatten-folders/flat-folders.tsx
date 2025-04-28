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
	rootFolders: Array<Folder>;
	searchString: string;
	selectedFolderId?: string;
	onFolderSelected?: (folder: Folder) => void;
	allowRootSelection?: boolean;
	filterChildren?: (folder: Folder) => boolean;
};

export const FlatFolders = ({
	rootFolders,
	searchString,
	onFolderSelected,
	selectedFolderId,
	allowRootSelection,
	filterChildren
}: FlatFoldersProps): React.JSX.Element => {
	const [hasMoreResults, setHasMoreResults] = React.useState(false);
	const [t] = useTranslation();
	const flatFilteredFolders = useMemo(() => {
		let remaining = 100;

		return rootFolders
			.map((rootFolder) => {
				if (remaining <= 0) {
					return { ...rootFolder, children: [] };
				}
				const currentFolder = {
					...rootFolder,
					name: getSystemFolderTranslatedName({ folderName: rootFolder.name }),
					children: []
				};
				const children = flattenAndFilterFoldersWithCap(
					rootFolder.children,
					searchString,
					remaining,
					filterChildren
				);
				remaining -= children.length;
				if (remaining <= 0) {
					setHasMoreResults(true);
				} else {
					setHasMoreResults(false);
				}

				return { ...currentFolder, children };
			})
			.filter((folder): folder is Folder => folder !== null);
	}, [filterChildren, rootFolders, searchString]);

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
