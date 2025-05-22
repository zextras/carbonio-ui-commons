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

export const FOLDERS = {
	USER_ROOT: '1',
	INBOX: '2',
	TRASH: '3',
	SPAM: '4',
	SENT: '5',
	DRAFTS: '6',
	CONTACTS: '7',
	TAGS: '8',
	CONVERSATIONS: '9',
	CALENDAR: '10',
	ROOT: '11',
	NOTEBOOK: '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS: '13',
	IM_LOGS: '14',
	TASKS: '15',
	BRIEFCASE: '16',
	LAST_SYSTEM_FOLDER_POSITION: '16.1'
};
