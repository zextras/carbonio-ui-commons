/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { QueryChip } from '@zextras/carbonio-search-ui';

export const convertSearchChipToString = (chip: QueryChip): string => {
	const chipString = (chip.value ? chip.value : chip.label) ?? '';
	const thereAreAnySpaces = chipString?.indexOf(' ') >= 0;
	return thereAreAnySpaces ? `"${chipString}"` : `${chipString}`;
};
