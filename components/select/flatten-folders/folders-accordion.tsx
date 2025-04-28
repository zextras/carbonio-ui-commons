/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion as MUIAccordion,
	Container as MUIContainer,
	AccordionSummary as MUIAccordionSummary,
	AccordionDetails as MUIAccordionDetails
} from '@mui/material';
import { filter } from 'lodash';

import { FOLDERS } from '../../../constants/folders';
import { theme } from '../../../theme/theme-mui';
import { Folder } from '../../../types';
import { hasId } from '../../../worker/handle-message';

type FolderAccordionProps = {
	folders: Array<Folder>;
	onFolderSelected: (arg: Folder) => void;
	selectedFolderId?: string;
	allowRootSelection: boolean;
	FolderAccordionCustomComponent: React.FC<{ folder: Folder }>;
	filterChildren?: (folder: Folder) => boolean;
};

export const FoldersAccordion = ({
	folders,
	onFolderSelected,
	FolderAccordionCustomComponent,
	selectedFolderId,
	allowRootSelection,
	filterChildren
}: FolderAccordionProps): React.JSX.Element => {
	const filteredFolders = folders.map((root) => ({
		...root,
		children: filter(root.children, filterChildren)
	}));

	const [openIds, setOpenIds] = useState<Array<string>>([FOLDERS.USER_ROOT]);

	const handleExpandFolderClick = (
		folderId: string,
		callback: React.Dispatch<React.SetStateAction<Array<string>>>
	): void =>
		callback((state: Array<string>) =>
			state.includes(folderId) ? state.filter((id) => id !== folderId) : [...state, folderId]
		);
	return (
		<MUIContainer disableGutters>
			{filteredFolders.map((folder) => (
				<MUIAccordion
					disableGutters
					slotProps={{ transition: { unmountOnExit: true } }}
					expanded={openIds.includes(folder.id)}
					key={folder.id}
				>
					<MUIAccordionSummary
						data-testid={`folder-accordion-item-${folder.id}`}
						onClick={(): void => {
							onFolderSelected?.(folder);
						}}
						expandIcon={
							folder?.children?.length > 0 &&
							!hasId(folder, 'all') && (
								<ExpandMoreIcon
									color="primary"
									onClick={(e): void => {
										e.preventDefault();
										handleExpandFolderClick(folder.id, setOpenIds);
									}}
								/>
							)
						}
						aria-controls="panel1a-content"
						id={folder.id}
						sx={{
							margin: 0,
							backgroundColor:
								folder.id === selectedFolderId
									? theme.palette.highlight.hover
									: theme.palette.gray6.regular,
							'&:hover': {
								backgroundColor:
									folder.id === selectedFolderId
										? theme.palette.highlight.active
										: theme.palette.gray6.hover
							}
						}}
					>
						<FolderAccordionCustomComponent folder={folder} />
					</MUIAccordionSummary>
					{folder?.children?.length > 0 && (
						<MUIAccordionDetails>
							<FoldersAccordion
								folders={folder.children}
								selectedFolderId={selectedFolderId}
								key={folder.id}
								allowRootSelection={allowRootSelection}
								FolderAccordionCustomComponent={FolderAccordionCustomComponent}
								onFolderSelected={onFolderSelected}
								filterChildren={filterChildren}
							/>
						</MUIAccordionDetails>
					)}
				</MUIAccordion>
			))}
		</MUIContainer>
	);
};
