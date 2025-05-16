/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { QueryChip } from '@zextras/carbonio-search-ui';

import { SEARCH_QUERY_PREFIXES } from '../constants/search';

const WHOLE_QUERY_REGEX = new RegExp(
	`^(?:(${Object.values(SEARCH_QUERY_PREFIXES).join('|')}):)?(.+)$`,
	'im'
);

const QUOTED_TERM_REGEX = /^"([^"]+)"$/im;

const MULTIWORD_TERM_REGEX = /^(\S+\s+\S+.*)$/im;

export const convertSearchChipToString = (chip: QueryChip): string => {
	const chipString = chip.value || chip.label || '';
	const match = chipString.match(WHOLE_QUERY_REGEX);

	if (!match) {
		return chipString;
	}

	const prefixAndColon = match[1] ? `${match[1]}:` : '';
	const term = match[2].trim();
	const isQuoted = QUOTED_TERM_REGEX.test(term);
	const isMultiword = !isQuoted && MULTIWORD_TERM_REGEX.test(term);

	return isMultiword ? `${prefixAndColon}"${term}"` : `${prefixAndColon}${term}`;
};
