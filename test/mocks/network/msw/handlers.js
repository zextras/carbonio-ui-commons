/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { rest } from 'msw';
import { handleGetMsgRequest } from './handle-get-msg';
import { handleCreateFolderRequest } from './handle-create-folder';

export const handlers = [
	// Mails handlers
	rest.post('/service/soap/GetMsgRequest', handleGetMsgRequest),

	// Calendars handlers
	rest.post('/service/soap/CreateFolderRequest', handleCreateFolderRequest)
];
