/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SEARCH_QUERY_PREFIXES } from '../constants/search';

type ConvertSearchChipToStringProps = {
	value?: string | boolean;
	label?: string | boolean;
};

const WHOLE_QUERY_REGEX = new RegExp(
	`^(?:(${Object.values(SEARCH_QUERY_PREFIXES).join('|')}):)?(.+)$`,
	'im'
);

function getChipString(chip: ConvertSearchChipToStringProps): string {
	if (typeof chip.value === 'string' && chip.value !== '') {
		return chip.value;
	}

	if (typeof chip.label === 'string' && chip.label !== '') {
		return chip.label;
	}

	return '';
}

const QUOTED_TERM_REGEX = /^"([^"]+)"$/im;

const MULTIWORD_TERM_REGEX = /^(\S+\s+\S+.*)$/im;

export const convertSearchChipToString = (chip: ConvertSearchChipToStringProps): string => {
	const match = getChipString(chip).match(WHOLE_QUERY_REGEX);

	if (!match) {
		return getChipString(chip);
	}

	const prefixAndColon = match[1] ? `${match[1]}:` : '';
	const term = match[2].trim();
	const isQuoted = QUOTED_TERM_REGEX.test(term);
	const isMultiword = !isQuoted && MULTIWORD_TERM_REGEX.test(term);

	return isMultiword ? `${prefixAndColon}"${term}"` : `${prefixAndColon}${term}`;
};
