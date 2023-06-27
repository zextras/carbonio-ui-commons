/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { map } from 'lodash';
import { getRandomView } from '../../folders/soap-roots-generator';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
const getShareInfo = (context?: any) => {
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();
	const ownerEmail = faker.internet.email(firstName, lastName);
	const fakeMid = faker.datatype.number();
	const fakeId = faker.datatype.number();
	return {
		ownerId: faker.datatype.uuid(),
		ownerEmail,
		ownerName: `${firstName} ${lastName}`,
		folderId: fakeId,
		folderUuid: faker.datatype.uuid(),
		folderPath: '/',
		view: getRandomView(),
		rights: 'rwidx',
		granteeType: 'grp',
		granteeId: faker.datatype.uuid(),
		granteeName: `_grp_rw_${ownerEmail}`,
		mid: `${fakeMid}`,
		...(context ?? {})
	};
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
const getShareInfoResponse = () => {
	const sharedAccount = getShareInfo({
		folderId: 1,
		rights: 'rwidx',
		view: 'unknown',
		granteeType: 'grp'
	});
	const randomLength = faker.datatype.number({ min: 50, max: 200 });
	const randomShares = [
		sharedAccount,
		...map(Array.from({ length: randomLength }), () => getShareInfo())
	];
	return {
		Header: {
			context: {
				session: {
					id: faker.datatype.number({ min: 1, max: 999999 }),
					_content: faker.datatype.number({ min: 1, max: 999999 })
				}
			}
		},
		Body: {
			GetShareInfoResponse: {
				share: randomShares,
				_jsns: 'urn:zimbraAccount'
			}
		}
	};
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const handleGetShareInfoRequest = (req, res, ctx) => {
	const response = getShareInfoResponse();
	return res(ctx.json(response));
};
