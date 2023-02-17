/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { DefaultBodyType, MockedRequest, RequestHandler, RestHandler } from 'msw';

export interface RestGenericRequest {
	Body: any;
}

export interface RestGenericResponse {
	Body: any;
	Header: any;
}

type RequestHandlerDefaultInfo = {
	header: string;
};

const handlers: Array<RequestHandler<RequestHandlerDefaultInfo, MockedRequest<DefaultBodyType>>> =
	[];

export const getRestHandlers = (): Array<
	RequestHandler<RequestHandlerDefaultInfo, MockedRequest<DefaultBodyType>>
> => [...handlers];

export const registerRestHandler = (...handler: RestHandler[]): void => {
	handlers.push(...handler);
};
