/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rest } from 'msw';

import { getSetupServer } from '../../../jest-setup';

export const createAPIInterceptor = <RequestParamsType, ResponseType = never>(
	apiAction: string,
	extraParamProperty?: string,
	response?: ResponseType
): Promise<RequestParamsType> =>
	new Promise<RequestParamsType>((resolve, reject) => {
		// Register a handler for the REST call
		getSetupServer().use(
			rest.post(`/service/soap/${apiAction}Request`, async (req, res, ctx) => {
				if (!req) {
					reject(new Error('Empty request'));
				}

				const reqActionParamWrapper = `${apiAction}Request`;
				const request = await req.json();
				const params = extraParamProperty
					? request.Body?.[reqActionParamWrapper][extraParamProperty]
					: request.Body?.[reqActionParamWrapper];
				resolve(params);

				return res(
					ctx.json({
						Body: {
							[`${apiAction}Response`]: response || {}
						}
					})
				);
			})
		);
	});
