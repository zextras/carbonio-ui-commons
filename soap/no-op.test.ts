/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { ErrorSoapBodyResponse } from '@zextras/carbonio-shell-ui';

import { NoOp } from './no-op';
import { createSoapAPIInterceptor } from '../test/mocks/network/msw/create-api-interceptor';
import { buildSoapErrorResponseBody } from '../test/mocks/utils/soap';

describe('NoOp', () => {
	it('should raise an error if the API returns a fault', async () => {
		const reason = faker.word.preposition(8);
		const response: ErrorSoapBodyResponse = buildSoapErrorResponseBody({ reason });
		createSoapAPIInterceptor('NoOp', response);
		await expect(NoOp).rejects.toThrowError(reason);
	});

	it('should resolve if the API returns success', () => {
		createSoapAPIInterceptor('NoOp');
		expect(NoOp).not.toThrow();
	});
});
