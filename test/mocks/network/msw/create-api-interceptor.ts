/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rest } from 'msw';

import { getSetupServer } from '../../../jest-setup';

export const createAPIInterceptor = <T>(apiAction: string): Promise<T> =>
	new Promise<T>((resolve, reject) => {
		// Register a handler for the REST call
		getSetupServer().use(
			rest.post(`/service/soap/${apiAction}Request`, async (req, res, ctx) => {
				if (!req) {
					reject(new Error('Empty request'));
				}

				const reqActionParamWrapper = `${apiAction}Request`;
				const params = (await req.json()).Body?.[reqActionParamWrapper];
				resolve(params);

				// Don't care about the actual response
				return res(
					ctx.json({
						Body: {
							[`${apiAction}Response`]: {}
						}
					})
				);
			})
		);
	});
