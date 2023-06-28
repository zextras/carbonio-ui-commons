/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// eslint-disable-next-line no-shadow
export const FolderActionsType = {
	NEW: 'new',
	MOVE: 'move',
	DELETE: 'delete',
	EDIT: 'edit',
	EMPTY: 'empty',
	REMOVE_FROM_LIST: 'removeFromList',
	SHARES_INFO: 'sharesInfo',
	SHARE: 'share',
	MARK_ALL_READ: 'read'
} as const;
