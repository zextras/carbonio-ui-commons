/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { FolderColorPicker, FolderColorPickerProps } from './folder-color-picker';

export type TagColorPickerProps = FolderColorPickerProps;

/** `ColorPicker` for tags: same standard palette as folders, with a tag-specific caption. */
export const TagColorPicker: FC<TagColorPickerProps> = (props) => {
	const [t] = useTranslation();

	return (
		<FolderColorPicker
			caption={t(
				'label.choose_tag_color_caption',
				'Choose a color to make this tag easier to recognize'
			)}
			{...props}
		/>
	);
};
