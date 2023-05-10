/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Grant, Meta, SoapRetentionPolicy } from '@zextras/carbonio-shell-ui/types/misc';
import { ComponentType } from 'react';

export type FolderFields = {
	// Additional Parameters
	isLink: boolean;
	depth: number;
	parent?: string;
	children: Array<Folder>;
};

export type UserFolder = BaseFolder & FolderFields & { isLink: false };

export type LinkFolder = BaseFolder & FolderFields & LinkFolderFields & { isLink: true };

export type SearchFolder = BaseFolder &
	Pick<FolderFields, 'parent' | 'isLink'> &
	SearchFolderFields;
export type Folder = UserFolder | LinkFolder;

export type Folders = { [id: string]: Folder };
export type Searches = { [id: string]: SearchFolder };
export type FolderState = {
	folders: Folders;
	searches: Searches;
};

export type FolderView =
	| 'search folder'
	| 'tag'
	| 'conversation'
	| 'message'
	| 'contact'
	| 'document'
	| 'appointment'
	| 'virtual conversation'
	| 'remote folder'
	| 'wiki'
	| 'task'
	| 'chat';
export type BaseFolder = {
	// Folder ID
	id: string;
	// Item's UUID - a globally unique identifier
	uuid: string;
	// Name of folder; max length 128; whitespace is trimmed by server; Cannot contain ':', '"', '/', or any character below 0x20
	name: string;
	// Absolute Folder path
	absFolderPath?: string;
	// ID of parent folder (absent for root folder)
	l?: string;
	// UUID of parent folder (absent for root folder)
	luuid?: string;
	// Flags - checked in UI (#), exclude free/(b)usy info, IMAP subscribed (*), does not (i)nherit rights from parent, is a s(y)nc folder with external data source, sync is turned on(~), folder does n(o)t allow inferiors / children
	f?: string;
	// color numeric; range 0-127; defaults to 0 if not present; client can display only 0-7
	color?: number;
	// RGB color in format #rrggbb where r,g and b are hex digits
	rgb?: string;
	// Number of unread messages in folder
	u?: number;
	// Number of unread messages with this tag, including those with the IMAP \Deleted flag set
	i4u?: number;
	// (optional) Default type for the folder; used by web client to decide which view to use;
	view?: FolderView;
	// Revision
	rev?: number;
	// Modified sequence
	ms?: number;
	// Modified date in seconds
	md?: number;
	// Number of non-subfolder items in folder
	n?: number;
	// Number of non-subfolder items in folder, including those with the IMAP \Deleted flag set
	i4n?: number;
	// Total size of all of non-subfolder items in folder
	s?: number;
	// Imap modified sequence
	i4ms?: number;
	// IMAP UIDNEXT
	i4next?: number;
	// URL (RSS, iCal, etc.) this folder syncs its contents to
	url?: string;
	activesyncdisabled: boolean;
	// Number of days for which web client would sync folder data for offline use
	webOfflineSyncDays?: number;
	// For remote folders, the access rights the authenticated user has on the folder - will contain the calculated (c)reate folder permission if the user has both (i)nsert and (r)ead access on the folder
	perm?: string;
	// recursive
	recursive: boolean;
	// URL to the folder in the REST interface for rest-enabled apps (such as notebook)
	rest?: string;
	// whether this folder can be deleted
	deletable: boolean;
	// custom metadata
	meta?: Array<Meta>;
	// ACL for sharing
	acl?: { grant: Array<Grant> };
	retentionPolicy?: SoapRetentionPolicy;
	// indicates whether this folder is displayed in Calendars
	checked?: boolean;
	// indicates the owner of the folder, specified only when it is not the main account
	owner?: string;
};

export type LinkFolderFields = {
	// Primary email address of the owner of the linked-to resource
	owner?: string;
	// Zimbra ID (guid) of the owner of the linked-to resource
	zid?: string;
	// Item ID of the linked-to resource in the remote mailbox
	rid?: string;
	// UUID of the linked-to resource in the remote mailbox
	ruuid?: string;
	// The name presently used for the item by the owner
	oname?: string;
	// If set, client should display reminders for shared appointments/tasks
	reminder: boolean;
	// If "tr" is true in the request, broken is set if this is a broken link
	broken: boolean;
};
export type SearchFolderFields = {
	// Query
	query?: string;
	// Sort by
	sortBy?: SortBy;
	// Comma-separated list. Legal values in list are:
	// appointment|chat|contact|conversation|document|message|tag|task|wiki (default is "conversation")
	types?: string;
};

export type SortBy =
	| 'dateDesc'
	| 'dateAsc'
	| 'idDesc'
	| 'idAsc'
	| 'subjDesc'
	| 'subjAsc'
	| 'nameDesc'
	| 'nameAsc'
	| 'durDesc'
	| 'durAsc'
	| 'none'
	| 'taskDueAsc'
	| 'taskDueDesc'
	| 'taskStatusAsc'
	| 'taskStatusDesc'
	| 'taskPercCompletedAsc'
	| 'taskPercCompletedDesc'
	| 'rcptAsc'
	| 'rcptDesc'
	| 'readAsc'
	| 'readDesc';

export type AccordionFolder = {
	id: string;
	label: string;
	folder: Folder;
	CustomComponent: ComponentType<{ folder: Folder }>;
	items: Array<AccordionFolder>;
};

export type TreeNode<T> = T & {
	id: string;
	children: TreeNode<T>[];
	parent?: string;
};
