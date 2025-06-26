/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { legacySoapFetch } from '@zextras/carbonio-ui-soap-lib';
import { isNil, omitBy } from 'lodash';

import { FolderView } from '../types/folder';

export const getFolderRequest = async (
	{ id, view }: { id?: string; view?: FolderView },
	account?: string
): Promise<any> => {
	const body = omitBy(
		{
			_jsns: 'urn:zimbraMail',
			folder: id
				? {
						l: id
					}
				: undefined,
			view,
			tr: 1
		},
		isNil
	);
	return legacySoapFetch('GetFolder', body, account);
};
