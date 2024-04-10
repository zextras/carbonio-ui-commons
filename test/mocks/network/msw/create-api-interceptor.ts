/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultBodyType, http, HttpResponse } from 'msw';

import { getSetupServer } from '../../../jest-setup';

type HandlerRequest<T> = DefaultBodyType & {
	Body: Record<string, T>;
};

export const createAPIInterceptor = <RequestParamsType, ResponseType = never>(
	apiAction: string,
	response?: ResponseType
): Promise<RequestParamsType> =>
	new Promise<RequestParamsType>((resolve, reject) => {
		// Register a handler for the REST call
		getSetupServer().use(
			http.post<never, HandlerRequest<RequestParamsType>>(
				`/service/soap/${apiAction}Request`,
				async ({ request }) => {
					if (!request) {
						reject(new Error('Empty request'));
						return HttpResponse.json(
							{},
							{
								status: 500,
								statusText: 'Empty request'
							}
						);
					}

					const reqActionParamWrapper = `${apiAction}Request`;
					const requestContent = await request.json();
					const params = requestContent?.Body?.[reqActionParamWrapper];
					resolve(params);

					return HttpResponse.json({
						Body: {
							[`${apiAction}Response`]: response || {}
						}
					});
				}
			)
		);
	});
