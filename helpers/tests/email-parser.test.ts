/* eslint-disable sonarjs/no-duplicate-string */
import { isValidEmail, parseEmail } from '../email-parser';

/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
describe('email-parser', () => {
	describe('isValidEmail', () => {
		it('undefined is not valid', () => {
			expect(isValidEmail(undefined)).toBe(false);
		});
		it('empty email is not valid', () => {
			expect(isValidEmail('')).toBe(false);
		});

		it('simple text is not valid', () => {
			expect(isValidEmail('invalid')).toBe(false);
		});

		it('email with invalid domain is not valid', () => {
			expect(isValidEmail('other@invalid')).toBe(false);
		});

		it('email with special character is not valid', () => {
			expect(isValidEmail('other@inv?al.id')).toBe(false);
		});

		it('email with invalid format is not valid', () => {
			expect(isValidEmail('@invalid.it')).toBe(false);
		});

		it('valid email is valid', () => {
			expect(isValidEmail('e@mail.it')).toBe(true);
		});

		it('valid email with cyrillic characters is valid', () => {
			expect(isValidEmail('почта@домен.рф')).toBe(true);
		});

		it('email with a single char as first level domain is not valid', () => {
			expect(isValidEmail('почта@домен.p')).toBe(false);
		});
	});

	describe('parseEmail', () => {
		it('cannot parse empty string', () => {
			expect(parseEmail('')).toStrictEqual(undefined);
		});
		it('clean Email in extended format with name', () => {
			expect(parseEmail('"Name" <email@domain.it>')).toBe('email@domain.it');
		});
		it('clean Email already ok', () => {
			expect(parseEmail('another@domain.it')).toBe('another@domain.it');
		});
		it('clean Email surrounded with <>', () => {
			expect(parseEmail('<other@domain.it>')).toBe('other@domain.it');
		});
		it('clean Email trimming spaces', () => {
			expect(parseEmail(' a@domain.it ')).toBe('a@domain.it');
		});
		it('email to trim in extended format', () => {
			expect(parseEmail('"Name" < email@domain.it >')).toBe('email@domain.it');
		});
		it('do not parse invalid email in extended format', () => {
			expect(parseEmail('"Name" <invalid@email>')).toBe(undefined);
		});
		it('do not parse an invalid email', () => {
			expect(parseEmail('invalidEmail ')).toBe(undefined);
		});
	});
});
