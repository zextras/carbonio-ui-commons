/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getUserSettings } from '@zextras/carbonio-shell-ui';
import type { UserPrefs } from '../types';

export const getPrefs = (): UserPrefs => {
	const { prefs } = getUserSettings();
	return <UserPrefs>prefs;
};
