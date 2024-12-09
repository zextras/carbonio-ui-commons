/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { TFunction } from 'i18next';

import { SoapApiError } from '../soap/errors/soap-api-error';

export function getErrorMessage(error: Error, t: TFunction): string {
	if (error instanceof SoapApiError) {
		return error.getLocalizedMessage(t);
	}

	return t('label.error_try_again', 'Something went wrong, please try again');
}
