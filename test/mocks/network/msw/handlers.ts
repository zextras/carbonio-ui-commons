/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { RequestHandler } from 'msw';
import { RequestHandlerDefaultInfo } from 'msw/lib/core/handlers/RequestHandler';

export interface CarbonioMailboxRestGenericRequest extends RequestHandlerDefaultInfo {
	Body: any;
}

export interface CarbonioMailboxRestGenericResponse {
	Body: any;
	Header: any;
}

const handlers: Array<RequestHandler> = [];

export const getRestHandlers = (): Array<RequestHandler> => [...handlers];

export const registerRestHandler = (...handler: Array<RequestHandler>): void => {
	handlers.push(...handler);
};
