/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { AnyColor, getColor, ListItem, ListItemProps } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

const CustomListItemHelper = styled(ListItem)``;

const StyledCustomListItem = styled(CustomListItemHelper)<{
	$baseBackgroundColor: AnyColor;
	$focusBackgroundColor: AnyColor;
}>`
	transition: none;
	&:focus,
	&:active {
		background: ${({ $focusBackgroundColor, theme }): string =>
			getColor($focusBackgroundColor, theme)};
		${CustomListItemHelper} {
			background: ${({ $focusBackgroundColor, theme }): string =>
				getColor($focusBackgroundColor, theme)};
		}
	}

	&:hover {
		background: ${({ $baseBackgroundColor, theme }): string =>
			getColor($baseBackgroundColor, theme)};
		&:focus,
		&:active {
			background: ${({ $focusBackgroundColor, theme }): string =>
				getColor($focusBackgroundColor, theme)};
		}
	}
`;

export const CustomListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
	function CustomListItemFn(
		{
			background = 'gray6',
			active,
			activeBackground = 'highlight',
			selected,
			selectedBackground = 'gray5',
			...rest
		},
		ref
	) {
		return (
			<StyledCustomListItem
				ref={ref}
				$baseBackgroundColor={
					(active && activeBackground) || (selected && selectedBackground) || background
				}
				$focusBackgroundColor={`${(active && activeBackground) || 'gray6'}.focus`}
				{...rest}
			/>
		);
	}
);
