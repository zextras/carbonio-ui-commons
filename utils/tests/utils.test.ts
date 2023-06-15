/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { faker } from '@faker-js/faker';
import { isValidFolderName } from '../utils';

const generateWordsWithLength = (length: number): string => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let result = '';
	for (let i = 0; i < length; i += 1) {
		const randomIndex = Math.floor(Math.random() * alphabet.length);
		const randomChar = alphabet[randomIndex];
		result += randomChar;
	}
	return result;
};

describe('Folder name validation', () => {
	test('valid folder name', () => {
		const folderName = faker.lorem.word();
		expect(isValidFolderName(folderName)).toBe(true);
	});

	test('folder name with special characters', () => {
		const folderName = `${faker.lorem.word()}/:`;
		expect(isValidFolderName(folderName)).toBe(false);
	});

	test('folder name with length less than 128', () => {
		const folderName = generateWordsWithLength(50);
		expect(isValidFolderName(folderName)).toBe(true);
	});

	test('folder name with length more than 128', () => {
		const folderName = generateWordsWithLength(130);
		expect(isValidFolderName(folderName)).toBe(false);
	});
});
