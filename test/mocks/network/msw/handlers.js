/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { rest } from 'msw';
import { handleGetMsgRequest } from './handle-get-msg';

export const handlers = [
	// Mails handlers
	rest.post('/service/soap/GetMsgRequest', handleGetMsgRequest)
];
