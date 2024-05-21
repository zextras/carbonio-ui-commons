/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
	ErrorSoapBodyResponse,
	JSNS,
	soapFetch,
	SuccessSoapResponse
} from '@zextras/carbonio-shell-ui';

type NoOpRequest = {
	_jsns: JSNS.MAIL;
};

type NoOpResponse = SuccessSoapResponse<{ _jsns: JSNS.MAIL }> | ErrorSoapBodyResponse;

export const NoOp = async (): Promise<void> => {
	const request = {
		_jsns: JSNS.MAIL
	} as const;
	const response = await soapFetch<NoOpRequest, NoOpResponse>('NoOp', request);
	if ('Fault' in response) {
		throw new Error(response.Fault.Reason.Text);
	}
};
