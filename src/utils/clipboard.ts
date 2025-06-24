/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
const legacyFallback = (text: string): Promise<void> => {
	const textArea = window.parent.document.createElement('textarea');
	window.parent.document.body.appendChild(textArea);
	textArea.value = text;
	textArea.select();
	const success = window.parent.document.execCommand('copy');
	window.parent.document.body.removeChild(textArea);
	return new Promise<void>((resolve, reject) => {
		success ? resolve() : reject();
	});
};

export const copyToClipboard = (text: string): Promise<void> => {
	if (!window.parent.navigator.clipboard) {
		return legacyFallback(text);
	}

	return window.parent.navigator.clipboard.writeText(text);
};
