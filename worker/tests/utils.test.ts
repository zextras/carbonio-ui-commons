/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { SoapLink } from '@zextras/carbonio-shell-ui';

import { getLinkIdMapKey } from '../utils';

describe('folder worker', () => {
	describe('getLinkIdMapKey', () => {
		test('returns null if the passed parameter is undefined', () => {
			expect(
				getLinkIdMapKey(
					// The undefined parameter is passed on purpose
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					undefined
				)
			).toBeNull();
		});

		test('returns null if the link zid is undefined', () => {
			const link: SoapLink = {
				id: `${faker.number.int()}`,
				uuid: faker.string.uuid(),
				name: faker.datatype.string(16),
				activesyncdisabled: true,
				deletable: true,
				recursive: true,
				reminder: false,
				broken: false,
				rid: `${faker.number.int()}`
			};
			expect(getLinkIdMapKey(link)).toBeNull();
		});

		test('returns null if the link rid is undefined', () => {
			const link: SoapLink = {
				id: `${faker.number.int()}`,
				uuid: faker.string.uuid(),
				name: faker.datatype.string(16),
				activesyncdisabled: true,
				deletable: true,
				recursive: true,
				reminder: false,
				broken: false,
				zid: `${faker.string.uuid()}`
			};
			expect(getLinkIdMapKey(link)).toBeNull();
		});

		test('returns ABC:DEF if the link zid is ABC and the rid is DEF', () => {
			const link: SoapLink = {
				id: `${faker.number.int()}`,
				uuid: faker.string.uuid(),
				name: faker.datatype.string(16),
				activesyncdisabled: true,
				deletable: true,
				recursive: true,
				reminder: false,
				broken: false,
				zid: 'ABC',
				rid: `DEF`
			};
			expect(getLinkIdMapKey(link)).toBe('ABC:DEF');
		});
	});
});
