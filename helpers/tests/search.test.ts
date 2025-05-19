/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';

import { SEARCH_QUERY_PREFIXES } from '../../constants/search';
import { convertSearchChipToString } from '../search';

describe('search', () => {
	describe('convertSearchChipToString', () => {
		it('should return an empty string if the chip is empty', () => {
			const chip = {};
			const result = convertSearchChipToString(chip);
			expect(result).toBe('');
		});

		it("should return value of the 'label' field if it is set and 'value' is not set", () => {
			const label = faker.word.noun();
			const chip = { label };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(label);
		});

		it("should return value of the 'value' field if it is set", () => {
			const value = faker.word.noun();
			const label = faker.word.noun();
			const chip = { value, label };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(value);
		});

		it("should return trimmed value of the 'value' field if it contains a space at the beginning or at end", () => {
			const value = ` ${faker.word.noun()} `;
			const chip = { value };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(value.trim());
		});

		it("should return the original value of the 'value' field if it is wrapped in double quotes", () => {
			const value = `"${faker.word.words(2)}"`;
			const chip = { value };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(value);
		});

		it('should return a string wrapped in double quotes if the chip value contains spaces and there is no known prefix', () => {
			const value = faker.word.words(2);
			const chip = { value };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(`"${value}"`);
		});

		it.each(Object.values(SEARCH_QUERY_PREFIXES))(
			"should return '%s:' followed by a string wrapped in double quotes if the chip value contains spaces and that known prefix",
			(prefix: string) => {
				const term = faker.word.words(3);
				const chip = { value: `${prefix}:${term}` };
				const result = convertSearchChipToString(chip);
				expect(result).toBe(`${prefix}:"${term}"`);
			}
		);

		it.each(Object.values(SEARCH_QUERY_PREFIXES))(
			"should return '%s:' followed by the chip value it contains that known prefix and the term is already wrapped in double quotes",
			(prefix: string) => {
				const term = `"${faker.word.words(3)}"`;
				const chip = { value: `${prefix}:${term}` };
				const result = convertSearchChipToString(chip);
				expect(result).toBe(`${prefix}:${term}`);
			}
		);

		it.each(Object.values(SEARCH_QUERY_PREFIXES))(
			"should return '%s:' followed by the chip value if it not contains spaces and that known prefix",
			(prefix: string) => {
				const term = faker.word.noun();
				const chip = { value: `${prefix}:${term}` };
				const result = convertSearchChipToString(chip);
				expect(result).toBe(`${prefix}:${term}`);
			}
		);

		it('should return the quoted chip whole value if it starts with an unknown prefix and contains spaces', () => {
			const prefix = 'unknownPrefix';
			const term = faker.word.words(3);
			const chip = { value: `${prefix}:${term}` };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(`"${prefix}:${term}"`);
		});

		it("should return the original chip whole value if it starts with an unknown prefix and doesn't contain spaces", () => {
			const prefix = 'unknownPrefix';
			const term = faker.word.noun();
			const chip = { value: `${prefix}:${term}` };
			const result = convertSearchChipToString(chip);
			expect(result).toBe(`${prefix}:${term}`);
		});
	});
});
