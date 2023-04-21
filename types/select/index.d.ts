/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SelectItem, LabelFactoryProps } from '@zextras/carbonio-design-system';

export type FolderSelectorItem = {
	label: string;
	value: string;
	color: string;
	disabled?: boolean | undefined;
};

interface CustomSelectItem extends SelectItem {
	color?: string;
}

export interface CustomLabelFactoryProps extends LabelFactoryProps {
	selected: CustomSelectItem[];
}
