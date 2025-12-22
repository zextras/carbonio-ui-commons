/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getUserSettings } from '@zextras/carbonio-shell-ui';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';

export const getPrefs = (): AccountSettingsPrefs => {
	const { prefs } = getUserSettings();
	return prefs as AccountSettingsPrefs;
};
