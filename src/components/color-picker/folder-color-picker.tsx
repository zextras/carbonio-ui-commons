/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ColorPicker, ColorPickerProps } from './color-picker';
import { ZIMBRA_STANDARD_COLORS } from '../../constants/utils';

export type FolderColorPickerProps = Omit<ColorPickerProps, 'colors'>;

/** `ColorPicker` bound to the standard folder palette (`ZIMBRA_STANDARD_COLORS`). */
export const FolderColorPicker: FC<FolderColorPickerProps> = (props) => {
	const [t] = useTranslation();

	const colors = useMemo(
		() =>
			ZIMBRA_STANDARD_COLORS.map((color) => ({
				hex: color.hex,
				label: t(`colors.${color.zLabel}`, color.zLabel)
			})),
		[t]
	);

	return <ColorPicker colors={colors} {...props} />;
};
