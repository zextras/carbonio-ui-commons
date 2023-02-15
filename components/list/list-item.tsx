/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getColor, ListItem } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

const CustomListItemHelper = styled(ListItem)``;

export const CustomListItem = styled(CustomListItemHelper).attrs(
	({
		background = 'gray6',
		active,
		activeBackground = 'highlight',
		selected,
		selectedBackground = 'gray5',
		theme
	}) => ({
		$baseBackgroundColor: getColor(
			(active && activeBackground) || (selected && selectedBackground) || background,
			theme
		),
		$focusBackgroundColor: getColor(`${(active && activeBackground) || 'gray6'}.focus`, theme)
	})
)`
	transition: none;
	&:focus,
	&:active {
		background: ${({ $focusBackgroundColor }): string => $focusBackgroundColor};
		${CustomListItemHelper} {
			background: ${({ $focusBackgroundColor }): string => $focusBackgroundColor};
		}
	}

	&:hover {
		background: ${({ $baseBackgroundColor }): string => $baseBackgroundColor};
		&:focus,
		&:active {
			background: ${({ $focusBackgroundColor }): string => $focusBackgroundColor};
		}
	}
`;
