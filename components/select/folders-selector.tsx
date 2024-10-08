/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, ReactElement, useCallback, useMemo } from 'react';

import { Padding, Row, Select, SelectItem } from '@zextras/carbonio-design-system';
import { find, map } from 'lodash';

import { TextUpperCase } from './color-select';
import { FolderSelectorLabelFactory, Square } from './select-label-factory';
import { FOLDERS } from '../../constants/folders';
import { useRoot } from '../../store/zustand/folder';
import type { FolderSelectorItem, OnChangeSelect } from '../../types/select';

type FolderSelectorProps = {
	defaultFolderId: string;
	onChange: OnChangeSelect;
	label?: string;
	folderItems: FolderSelectorItem[];
	disabled?: boolean;
};

const FolderNameRender: FC<{ folder: FolderSelectorItem }> = ({ folder }) => {
	const root = useRoot(folder.value ?? '');
	return (
		<>
			<Row wrap={'nowrap'}>
				<Padding right="small">
					<Square color={folder.color} />
				</Padding>
				<TextUpperCase>{folder.label}</TextUpperCase>
				<Row takeAvailableSpace>
					{root && root.id !== FOLDERS.USER_ROOT && (
						<Padding left="small" style={{ overflow: 'hidden' }}>
							<TextUpperCase color={'gray1'}>{`(${root.name})`}</TextUpperCase>
						</Padding>
					)}
				</Row>
			</Row>
		</>
	);
};

export const FoldersSelector = ({
	defaultFolderId,
	onChange,
	label,
	folderItems,
	disabled
}: FolderSelectorProps): ReactElement | null => {
	const items = useMemo(
		() =>
			map(folderItems, (item) => ({
				label: item.label,
				value: item.value,
				color: item.color,
				customComponent: <FolderNameRender folder={item}></FolderNameRender>
			})),
		[folderItems]
	);

	const defaultFolderSelection = useMemo(() => {
		const defaultFold = find(items, ['value', defaultFolderId]);
		const defaultFolder = {
			value: defaultFold?.value ?? items?.[0]?.value,
			label: defaultFold?.label ?? items?.[0]?.label,
			color: defaultFold?.color ?? items?.[0]?.color
		};
		return find(items, ['value', defaultFolderId]) ?? defaultFolder;
	}, [items, defaultFolderId]);

	const onSelectedFolderChange = useCallback(
		(id: string | null | Array<SelectItem>) => onChange(id),
		[onChange]
	);

	return items && defaultFolderSelection ? (
		<Select
			label={label}
			onChange={onSelectedFolderChange}
			items={items}
			defaultSelection={defaultFolderSelection}
			disablePortal
			disabled={disabled}
			LabelFactory={FolderSelectorLabelFactory}
		/>
	) : null;
};
