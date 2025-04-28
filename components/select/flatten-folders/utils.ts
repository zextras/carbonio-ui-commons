/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccordionItemType } from '@zextras/carbonio-design-system';
import { t } from '@zextras/carbonio-shell-ui';

import { FOLDER_VIEW, ROOT_NAME, ZIMBRA_STANDARD_COLORS } from '../../../constants';
import { FOLDERS } from '../../../constants/folders';
import { getFolderIdParts, isSystemFolder } from '../../../helpers/folders';
import { Folder } from '../../../types';

export function flattenAndFilterFoldersWithCap(
	folders: Array<Folder>,
	search: string,
	limit: number
): Array<Folder> {
	if (limit <= 0) return [];

	const lowerCaseSearch = search.toLowerCase();

	const flattenAndFilter = (foldersToProcess: Array<Folder>): Array<Folder> =>
		foldersToProcess.flatMap((folder) => {
			const isMatch = folder.name.toLowerCase().includes(lowerCaseSearch);
			const matched = isMatch ? [{ ...folder, children: [] }] : [];
			return [...matched, ...flattenAndFilter(folder.children)];
		});

	return flattenAndFilter(folders).slice(0, limit);
}

export const capitalise = (word: string): string => {
	const asciiRef = word?.charCodeAt(0);
	const newAsciiRef = asciiRef - 32;
	const newChar = String.fromCharCode(newAsciiRef);
	return word ? newChar + word.substring(1) : '';
};

export const getFolderIconColor = (f: Folder | AccordionItemType): string => {
	if ('color' in f && f?.color) {
		return Number(f.color) < 10
			? ZIMBRA_STANDARD_COLORS[Number(f.color)].hex
			: (f?.rgb ?? ZIMBRA_STANDARD_COLORS[0].hex);
	}
	return ZIMBRA_STANDARD_COLORS[0].hex;
};

const getFolderDefaultIcon = (folder: Folder | AccordionItemType): string => {
	const folderView = 'view' in folder && folder.view;
	switch (folderView) {
		case FOLDER_VIEW.appointment:
			return 'Calendar2';
		default:
			return 'FolderOutline';
	}
};

export const getFolderIconName = (folder: Folder | AccordionItemType): string | null => {
	const { id } = getFolderIdParts(folder.id);
	if (
		id === FOLDERS.USER_ROOT ||
		('isLink' in folder && folder.isLink && folder.oname === ROOT_NAME)
	) {
		return null;
	}

	const folderDefaultIcon = getFolderDefaultIcon(folder);

	if (id && isSystemFolder(id)) {
		switch (id) {
			case FOLDERS.INBOX:
				return 'InboxOutline';
			case FOLDERS.DRAFTS:
				return 'FileOutline';
			case FOLDERS.SENT:
				return 'PaperPlaneOutline';
			case FOLDERS.SPAM:
				return 'SlashOutline';
			case FOLDERS.TRASH:
				return 'Trash2Outline';
			default:
				return folderDefaultIcon;
		}
	}
	return folderDefaultIcon;
};

export const translatedSystemFolders = (): Array<string> => [
	t('folders.inbox', 'Inbox'),
	t('folders.sent', 'Sent'),
	t('folders.drafts', 'Drafts'),
	t('folders.trash', 'Trash'),
	t('folders.spam', 'Spam'),
	t('folders.junk', 'Junk')
];

type GetSystemFolderProps = {
	folderId?: string;
	folderName: string;
};

export const getSystemFolderTranslatedName = ({ folderName }: GetSystemFolderProps): string => {
	if (folderName) {
		switch (folderName) {
			case 'Inbox':
				return t('folders.inbox', 'Inbox');
			case 'Sent':
				return t('folders.sent', 'Sent');
			case 'Drafts':
				return t('folders.drafts', 'Drafts');
			case 'Trash':
				return t('folders.trash', 'Trash');
			case 'Spam':
				return t('folders.spam', 'Spam');
			case 'Junk':
				return t('folders.junk', 'Junk');
			default:
				return folderName;
		}
	}
	return folderName;
};

export const getFolderTranslatedName = ({ folderId, folderName }: GetSystemFolderProps): string => {
	const { id } = getFolderIdParts(folderId ?? '');
	if (id && isSystemFolder(id)) {
		return getSystemFolderTranslatedName({ folderName });
	}

	return folderName;
};
