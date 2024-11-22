/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { TFunction } from 'i18next';

import { ApiError } from './api-error';

/**
 * Implements a generic API error which can be used when no specific error is available
 */
export class GenericApiError extends ApiError {
	/**
	 * Returns the generic localized message for the error
	 * @param t - The translation function
	 * @returns The localized message
	 */
	// eslint-disable-next-line class-methods-use-this
	public getLocalizedMessage(t: TFunction): string {
		return t('label.error_try_again', 'Something went wrong, please try again');
	}
}
