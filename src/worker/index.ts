/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const folderWorker = new Worker(new URL('./folder', import.meta.url));
export const tagsWorker = new Worker(new URL('./tags', import.meta.url));
