/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement, useCallback, useMemo } from 'react';

import { Container, Padding, Select, SelectItem, Text } from '@zextras/carbonio-design-system';
import { find, map } from 'lodash';

import { FolderSelectorLabelFactory, Square } from './select-label-factory';
import type { FolderSelectorItem } from '../../types/select';

type FolderSelectorProps = {
	defaultFolderId: string;
	onChange: (selectedItem: SelectItem) => void;
	label?: string;
	folderItems: FolderSelectorItem[];
	disabled?: boolean;
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
				customComponent: (
					<Container width="fit" mainAlignment="flex-start" orientation="horizontal">
						<Square color={item.color} />
						<Padding left="small">
							<Text>{item.label}</Text>
						</Padding>
					</Container>
				)
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

	const onSelectedFolderChange = useCallback((id) => onChange(id), [onChange]);

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
