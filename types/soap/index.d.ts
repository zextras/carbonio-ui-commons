/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export type FolderAction = {
	op: string;
	id: string;
	l?: string;
	recursive?: boolean;
	name?: string;
	color?: number;
	f?: string;
	zid?: string;
};
