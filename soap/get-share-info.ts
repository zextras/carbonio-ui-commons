/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ErrorSoapBodyResponse, soapFetch } from '@zextras/carbonio-shell-ui';
import { isEmpty } from 'lodash';

import { ResFolder } from '../utils';

type GetShareInfoRequest = {
	_jsns: string;
	includeSelf: number;
};

type GetShareInfoResponse = {
	_jsns: string;
	share: Array<ResFolder>;
};

export const getShareInfoRequest = async (): Promise<{
	isFulfilled: boolean;
	folders: Array<ResFolder>;
}> => {
	const result = await soapFetch<GetShareInfoRequest, GetShareInfoResponse | ErrorSoapBodyResponse>(
		'GetShareInfo',
		{
			_jsns: 'urn:zimbraAccount',
			includeSelf: 0
		}
	);

	if ('Fault' in result) {
		return Promise.reject(result.Fault);
	}

	return Promise.resolve({ isFulfilled: !isEmpty(result), folders: result?.share ?? [] });
};
