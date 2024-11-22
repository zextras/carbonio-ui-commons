/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { SoapFault } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

import { setupHook } from '../../../test/test-setup';
import { GenericApiError } from '../generic-api-error';

describe('GenericApiError', () => {
	it('should be an instance of Error', () => {
		const fault: SoapFault = {
			Code: { Value: faker.string.uuid() },
			Detail: { Error: { Code: faker.string.uuid(), Trace: faker.string.alphanumeric() } },
			Reason: { Text: faker.lorem.sentence() }
		};
		const error = new GenericApiError(fault);
		expect(error).toBeInstanceOf(Error);
	});

	it("should has the 'message' attribute set with the reason text of the given fault", () => {
		const fault: SoapFault = {
			Code: { Value: faker.string.uuid() },
			Detail: { Error: { Code: faker.string.uuid(), Trace: faker.string.alphanumeric() } },
			Reason: { Text: faker.lorem.sentence() }
		};
		const error = new GenericApiError(fault);
		expect(error.message).toBe(fault.Reason.Text);
	});

	it('should return the generic localized message', () => {
		const fault: SoapFault = {
			Code: { Value: faker.string.uuid() },
			Detail: { Error: { Code: faker.string.uuid(), Trace: faker.string.alphanumeric() } },
			Reason: { Text: faker.lorem.sentence() }
		};
		const error = new GenericApiError(fault);

		const {
			result: {
				current: [t]
			}
		} = setupHook(useTranslation);

		expect(error.getLocalizedMessage(t)).toBe('Something went wrong, please try again');
	});
});
