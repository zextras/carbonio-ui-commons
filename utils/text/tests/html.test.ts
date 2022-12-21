/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { convertHtmlToPlainText } from '../html';

describe('html', () => {
	test('convertHtmlToPlainText with plain text', () => {
		expect(convertHtmlToPlainText('')).toBe('');
		expect(convertHtmlToPlainText('lorem ipsum')).toBe('lorem ipsum');
		expect(convertHtmlToPlainText('lorem\nipsum')).toBe('lorem\nipsum');
	});

	test('convertHtmlToPlainText with span', () => {
		expect(convertHtmlToPlainText('<span>lorem ipsum</span>')).toBe('lorem ipsum');
		expect(convertHtmlToPlainText('<span>lorem</span> ipsum')).toBe('lorem ipsum');
		expect(convertHtmlToPlainText('lorem <span>ipsum</span>')).toBe('lorem ipsum');
		expect(convertHtmlToPlainText('lorem <span>ipsum</span> dolor')).toBe('lorem ipsum dolor');
	});

	test('convertHtmlToPlainText with html', () => {
		expect(convertHtmlToPlainText('lorem ipsum <p>lorem ipsum</p> <div>lorem ipsum</div>')).toBe(
			'lorem ipsum \n\nlorem ipsum \nlorem ipsum'
		);
	});

	test('convertHtmlToPlainText with html and script', () => {
		expect(
			convertHtmlToPlainText(
				'lorem ipsum <p>lorem ipsum</p> <div>lorem ipsum</div> <script>lorem ipsum</script>'
			)
		).toBe('lorem ipsum \n\nlorem ipsum \nlorem ipsum ');
	});

	test('convertHtmlToPlainText with html and style', () => {
		expect(
			convertHtmlToPlainText(
				'lorem ipsum <p>lorem ipsum</p> <div>lorem ipsum</div> <style>lorem ipsum</style>'
			)
		).toBe('lorem ipsum \n\nlorem ipsum \nlorem ipsum ');
	});

	test('convertHtmlToPlainText with html and br', () => {
		expect(
			convertHtmlToPlainText(
				'lorem ipsum <p>lorem ipsum</p> <div>lorem ipsum</div> <br><div>lorem ipsum</div>'
			)
		).toBe('lorem ipsum \n\nlorem ipsum \nlorem ipsum \n\nlorem ipsum');
	});

	test('convertHtmlToPlainText with img', () => {
		expect(
			convertHtmlToPlainText(
				'lorem ipsum <img src="https://www.zextras.com/wp-content/uploads/2020/10/Logo_Zextras_2020.png" alt="Zextras">'
			)
		).toBe('lorem ipsum ');
	});
});
