/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import type { ErrorSoapBodyResponse } from '@zextras/carbonio-ui-soap-lib';

import { NoOp } from './no-op';
import { createSoapAPIInterceptor } from '../__test__/mocks/network/msw/create-api-interceptor';
import { buildSoapErrorResponseBody } from '../__test__/mocks/utils/soap';

describe('NoOp', () => {
	it('should raise an error if the API returns a fault', async () => {
		const reason = faker.word.preposition(8);
		const response: ErrorSoapBodyResponse = buildSoapErrorResponseBody({ reason });
		createSoapAPIInterceptor('NoOp', response);
		await expect(NoOp).rejects.toThrow(reason);
	});

	it('should resolve if the API returns success', () => {
		createSoapAPIInterceptor('NoOp');
		expect(NoOp).not.toThrow();
	});
});
