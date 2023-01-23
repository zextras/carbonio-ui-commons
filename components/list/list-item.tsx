/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getColor, ListItem } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

export const CustomListItem = styled(ListItem).attrs<
	Record<string, unknown>,
	{
		baseBackgroundColor: string;
		focusBackgroundColor: string;
	}
>(
	({
		background = 'gray6',
		active,
		activeBackground = 'highlight',
		selected,
		selectedBackground = 'gray5',
		theme
	}) => ({
		baseBackgroundColor: getColor(
			(active && activeBackground) || (selected && selectedBackground) || background,
			theme
		),
		focusBackgroundColor: getColor(`${(active && activeBackground) || 'gray6'}.focus`, theme)
	})
)`
	transition: none;
	&:focus {
		background: ${({ focusBackgroundColor }): string => focusBackgroundColor};
	}

	&:active {
		background: ${({ focusBackgroundColor }): string => focusBackgroundColor};
	}

	&:hover {
		background: ${({ baseBackgroundColor }): string => baseBackgroundColor};
	}
`;
