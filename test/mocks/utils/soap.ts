/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { ErrorSoapBodyResponse, SuccessSoapResponse } from '@zextras/carbonio-shell-ui';

export const buildSoapResponse = <T>(responseData: Record<string, T>): SuccessSoapResponse<T> => ({
	Header: {
		context: {}
	},
	Body: responseData
});

export const buildSoapErrorResponseBody = ({
	code = faker.number.int().toString(),
	detail = faker.word.preposition(2),
	reason = faker.word.preposition()
}: {
	code?: string;
	detail?: string;
	reason?: string;
} = {}): ErrorSoapBodyResponse => ({
	Fault: {
		Detail: { Error: { Code: code, Detail: detail } },
		Reason: { Text: reason }
	}
});
