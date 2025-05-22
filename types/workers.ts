/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { SoapNotify } from '@zextras/carbonio-shell-ui';
import { useInfoRefresh } from '@zextras/carbonio-ui-soap-lib';

export type SyncNotifyMessage = {
	op: 'notify';
	notify: SoapNotify;
};

export type SyncRefreshMessage = ReturnType<typeof useInfoRefresh> & {
	op: 'refresh';
};

export type SyncMessage = SyncNotifyMessage | SyncRefreshMessage;

export type WorkerMessage<T> = {
	data: SyncMessage & T;
};
