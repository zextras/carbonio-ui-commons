/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { SoapFault } from '@zextras/carbonio-shell-ui';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { setupHook } from '../../__test__/test-setup';
import { SoapApiError } from '../../soap/errors/soap-api-error';
import { getErrorMessage } from '../errors';

class FakeSoapApiError extends SoapApiError {
	constructor(
		fault: SoapFault,
		private fakeLocalizedMessage: string
	) {
		super(fault);
	}

	public getLocalizedMessage(t: TFunction): string {
		return this.fakeLocalizedMessage;
	}
}

describe('Errors', () => {
	describe('getErrorMessage', () => {
		it('should return the generic localized error message', () => {
			const {
				result: {
					current: [t]
				}
			} = setupHook(useTranslation);

			const error = new Error('Test error');
			expect(getErrorMessage(error, t)).toBe('Something went wrong, please try again');
		});

		it('should return the localized error message for a SoapApiError', () => {
			const fault: SoapFault = {
				Code: { Value: faker.string.uuid() },
				Detail: { Error: { Code: faker.string.uuid(), Trace: faker.string.alphanumeric() } },
				Reason: { Text: faker.lorem.sentence() }
			};
			const fakeLocalizedErrorMessage = faker.lorem.sentence();
			const error = new FakeSoapApiError(fault, fakeLocalizedErrorMessage);

			const {
				result: {
					current: [t]
				}
			} = setupHook(useTranslation);

			expect(getErrorMessage(error, t)).toBe(fakeLocalizedErrorMessage);
		});
	});
});
