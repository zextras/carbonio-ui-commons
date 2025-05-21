/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const FOLDER_VIEW: FolderViewType = {
	search_folder: 'search folder',
	tag: 'tag',
	conversation: 'conversation',
	message: 'message',
	contact: 'contact',
	document: 'document',
	appointment: 'appointment',
	virtual_conversation: 'virtual conversation',
	remote_folder: 'remote folder',
	wiki: 'wiki',
	task: 'task',
	chat: 'chat'
} as const;

type FolderViewType = {
	search_folder: 'search folder';
	tag: 'tag';
	conversation: 'conversation';
	message: 'message';
	contact: 'contact';
	document: 'document';
	appointment: 'appointment';
	virtual_conversation: 'virtual conversation';
	remote_folder: 'remote folder';
	wiki: 'wiki';
	task: 'task';
	chat: 'chat';
};

// eslint-disable-next-line no-shadow
export enum TagsActionsType {
	NEW = 'new',
	DELETE = 'delete',
	EDIT = 'edit',
	Apply = 'apply'
}

export const DRAG_DATA_TYPE = {
	MESSAGE: 'message',
	CONVERSATION: 'conversation',
	FOLDER: 'folder',
	CONTACT: 'contact'
} as const;

export const ZIMBRA_STANDARD_COLORS = [
	{ zValue: 0, hex: '#000000', zLabel: 'black' },
	{ zValue: 1, hex: '#2b73d2', zLabel: 'blue' },
	{ zValue: 2, hex: '#29B6F6', zLabel: 'cyan' },
	{ zValue: 3, hex: '#66BB6A', zLabel: 'green' },
	{ zValue: 4, hex: '#7e57c2', zLabel: 'purple' },
	{ zValue: 5, hex: '#ef5350', zLabel: 'red' },
	{ zValue: 6, hex: '#ffc107', zLabel: 'yellow' },
	{ zValue: 7, hex: '#edaeab', zLabel: 'pink' },
	{ zValue: 8, hex: '#828282', zLabel: 'gray' },
	{ zValue: 9, hex: '#FF7043', zLabel: 'orange' }
];

export enum JSNS {
	ACCOUNT = 'urn:zimbraAccount',
	ADMIN = 'urn:zimbraAdmin',
	MAIL = 'urn:zimbraMail',
	ALL = 'urn:zimbra',
	SYNC = 'urn:zimbraSync'
}

export const ROOT_NAME = 'USER_ROOT';
