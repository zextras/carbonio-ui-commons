/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { xmlSoapFetch } from '@zextras/carbonio-shell-ui';

export const modifyPrefsRequest = async (pref: string): Promise<unknown> =>
	xmlSoapFetch(
		'ModifyPrefs',
		`<ModifyPrefsRequest xmlns="urn:zimbraAccount"><pref name="zimbraPrefSortOrder">${pref}</pref></ModifyPrefsRequest>`
	);
