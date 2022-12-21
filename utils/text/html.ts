/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const P_TAG = /<p[^>]*>/g;
const BR_TAG = /<br[^>]*>/g;
const DIV_TAG = /<div[^>]*>/g;
const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const STYLE_TAG = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;

export const convertHtmlToPlainText = (html: string): string => {
	if (!html) {
		return '';
	}

	let result = html
		// Remove script tags
		.replace(SCRIPT_TAG, '')
		// Remove style tags
		.replace(STYLE_TAG, '')
		// Add a couple of newline before every p tag
		.replace(P_TAG, '\n\n<p>')
		// Convert br tags to new lines
		.replace(BR_TAG, '\n')
		// Add a newline before every p tag
		.replace(DIV_TAG, '\n<div>');
	const doc = new DOMParser().parseFromString(result, 'text/html');
	result = doc.body.textContent || '';

	return result;
};
