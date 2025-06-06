/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { AccountSettingsPrefs, getUserSettings } from '@zextras/carbonio-shell-ui';

export const getPrefs = (): AccountSettingsPrefs => {
	const { prefs } = getUserSettings();
	return prefs;
};
