/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ErrorSoapBodyResponse, legacySoapFetch } from '@zextras/carbonio-ui-soap-lib';

import { JSNS } from '../constants/utils';

/**
 * TODO remove this file and use an export from @zextras/carbonio-ui-soap-lib
 * @see https://zextras.atlassian.net/browse/CO-2160
 */

type NoOpRequest = {
	_jsns: JSNS.MAIL;
};

type NoOpResponse = { _jsns: JSNS.MAIL } | ErrorSoapBodyResponse;

/**
 * @deprecated use the export from @zextras/carbonio-ui-soap-lib
 */
export const NoOp = async (): Promise<void> => {
	const request = {
		_jsns: JSNS.MAIL
	} as const;
	const response = await legacySoapFetch<NoOpRequest, NoOpResponse>('NoOp', request);
	if ('Fault' in response) {
		throw new Error(response.Fault.Reason.Text);
	}
};
