/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type ErrorResponse<K> = { error: K };

type DataResponse<T> = { data: T };

export async function apiWrapper<T, K>(
	promise: Promise<Response>
): Promise<DataResponse<T> | ErrorResponse<K>> {
	return Promise.allSettled([promise]).then(async ([result]) => {
		if (result.status === 'fulfilled') {
			return { data: (await result.value.json()) as T };
		}
		return { error: result.reason };
	});
}
