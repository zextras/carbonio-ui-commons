/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function parseEmail(input: string): string | undefined {
	const extracted = extractEmail(input);
	return isValidEmail(extracted) ? extracted : undefined;
}

export function isValidEmail(email: string | undefined): boolean {
	// eslint-disable-next-line max-len, prettier/prettier, no-useless-escape
	const validEmailRegex = /^[\p{L}\p{N}.-_]+@[\p{L}\p{N}][\p{L}\p{N}-]*[\p{L}\p{N}]+\.[\p{L}\p{N}]{2,}$/u;
	return validEmailRegex.test(String(email).toLowerCase());
}

function extractEmail(input: string): string {
	const trimmedInput = input.trim();
	const caputured = /.*<(.*)>/.exec(trimmedInput);
	if (caputured && caputured.length > 1) {
		return caputured[1].trim();
	}
	return trimmedInput;
}
