/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { RestHandler } from 'msw';
import {
	b as RequestHandler,
	c as DefaultBodyType,
	i as RequestHandlerDefaultInfo,
	M as MockedRequest
} from 'msw/lib/glossary-dc3fd077';

export interface RestGenericRequest {
	Body: any;
}

export interface RestGenericResponse {
	Body: any;
	Header: any;
}

const handlers: Array<RequestHandler<RequestHandlerDefaultInfo, MockedRequest<DefaultBodyType>>> =
	[];

export const getRestHandlers = (): Array<
	RequestHandler<RequestHandlerDefaultInfo, MockedRequest<DefaultBodyType>>
> => [...handlers];

export const registerRestHandler = (...handler: RestHandler[]): void => {
	handlers.push(...handler);
};
