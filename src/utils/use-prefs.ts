/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { AccountSettingsPrefs, useUserSettings } from '@zextras/carbonio-shell-ui';

export const usePrefs = (): AccountSettingsPrefs => {
	const { prefs } = useUserSettings();
	return prefs;
};
