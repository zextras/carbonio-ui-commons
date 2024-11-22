/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { SoapFault } from '@zextras/carbonio-shell-ui';
import { TFunction } from 'i18next';

export abstract class ApiError extends Error {
	constructor(protected fault: SoapFault) {
		super(fault.Reason.Text);
	}

	public abstract getLocalizedMessage(t: TFunction): string;
}
