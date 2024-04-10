/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FolderMessage, SoapNotify } from '@zextras/carbonio-shell-ui';

import { getLinkIdMapKey } from './utils';
import type {
	BaseFolder,
	Folder,
	Folders,
	LinkFolder,
	LinkFolderFields,
	Searches,
	SearchFolderFields,
	SoapFolder,
	SoapLink,
	SoapSearchFolder,
	UserFolder
} from '../types/folder';
import { FolderView, LinksIdMap } from '../types/folder';

const IM_LOGS = '14';
const USER_ROOT = '1';

let folders: Folders = {};
const searches: Searches = {};
const linksIdMap: LinksIdMap = {};
// used to check if a newly created folder is being added to the correct store
let view: string | undefined;

export const testUtils = {
	getFolders: (): Folders => folders,
	resetFolders: (): void => {
		folders = {};
	},
	setFolders: (data: Folders): void => {
		folders = data;
	},
	setCurrentView: (current: FolderView): void => {
		view = current;
	},
	getCurrentView: (): string | undefined => view
};

const sortFoldersByName = (obj: Array<Folder>): Array<Folder> =>
	obj.sort((a, b) => {
		const aLowerName = a.name.toLowerCase();
		const bLowerName = b.name.toLowerCase();
		if (aLowerName < bLowerName) {
			return -1;
		}
		if (aLowerName > bLowerName) {
			return 1;
		}
		return 0;
	});

const updateChildren = (folder: Folder, changes: any): any => {
	if (changes.absFolderPath && folder.children.length) {
		folder.children.forEach((child) => {
			const childFolder = folders[child.id];
			if (changes.absFolderPath && childFolder.absFolderPath) {
				const paths = childFolder.absFolderPath.split('/').slice(2);
				childFolder.absFolderPath = `${changes.absFolderPath}/${paths.join('/')}`;
			}
			if (childFolder.children.length) {
				updateChildren(childFolder, changes);
			}
		});
	}
};

export const testFolderIsChecked = ({ string }: { string: string | undefined }): boolean =>
	/#/.test(string || '');

const omit = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	link: _1,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	folder: _2,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	search: _3,
	...obj
}: Partial<SoapFolder>): Partial<SoapFolder> => obj;

export const hasId = (f: { id: string }, id: string): boolean => f.id.split(':').includes(id);
export const normalize = (f: SoapFolder, p?: Folder): BaseFolder => ({
	id: f.id,
	uuid: f.uuid,
	name: f.name,
	absFolderPath: f.absFolderPath,
	l: f.l,
	luuid: f.luuid,
	checked: testFolderIsChecked({ string: f.f }),
	f: f.f,
	// the type defined in shell is not correct refs: SHELL-118
	// FIXME: remove the cast when the type will be fixed
	color: (f.color as unknown as number) || p?.color,
	rgb: f.rgb,
	u: f.u,
	i4u: f.i4u,
	view: f.view,
	rev: f.rev,
	ms: f.ms,
	md: f.md,
	n: f.n,
	i4n: f.i4n,
	s: f.s,
	i4ms: f.i4ms,
	i4next: f.i4next,
	url: f.url,
	activesyncdisabled: !!f.activesyncdisabled,
	webOfflineSyncDays: f.webOfflineSyncDays,
	perm: f.perm,
	recursive: !!f.recursive,
	rest: f.rest,
	deletable: !!f.deletable,
	meta: f.meta,
	acl: f.acl,
	retentionPolicy: f.retentionPolicy
});

export const normalizeSearch = (s: SoapSearchFolder): BaseFolder & SearchFolderFields => ({
	...normalize(s),
	query: s.query,
	sortBy: s.sortBy,
	types: s.types
});

export const normalizeLink = (l: SoapLink, p?: Folder): BaseFolder & LinkFolderFields => ({
	...normalize(l, p),
	owner: l.owner,
	zid: l.zid,
	rid: l.rid,
	ruuid: l.ruuid,
	oname: l.oname,
	reminder: !!l.reminder,
	broken: !!l.broken
});

export const processSearch = (soapSearch: SoapSearchFolder, parent: Folder): void => {
	const search = {
		...normalizeSearch(soapSearch),
		parent: parent?.id,
		isLink: parent?.isLink
	};
	searches[search.id] = search;
};

export const processLink = (soapLink: SoapLink, depth: number, parent?: Folder): LinkFolder => {
	const link = {
		...normalizeLink(soapLink, parent),
		isLink: true,
		children: [],
		parent: parent?.id,
		depth
	} as LinkFolder;
	// eslint-disable-next-line no-param-reassign
	folders[soapLink.id] = link;

	// Get the zid:rid key of the link and add it to the links id map
	const linkIdMapKey = getLinkIdMapKey(soapLink);
	linkIdMapKey && (linksIdMap[linkIdMapKey] = soapLink.id);

	soapLink?.folder?.forEach((f) => {
		if (!hasId(f, IM_LOGS)) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const child = processFolder(f, depth + 1, link);
			link.children.push(child);
		}
	});
	soapLink?.link?.forEach((l) => {
		if (!hasId(l, IM_LOGS)) {
			const child = processLink(l, depth + 1, link);
			link.children.push(child);
		}
	});
	soapLink?.search?.forEach((s) => {
		processSearch(s, link);
	});

	return link;
};

export const processFolder = (
	soapFolder: SoapFolder,
	depth: number,
	parent?: Folder
): UserFolder => {
	const folder: UserFolder = {
		...normalize(soapFolder, parent),
		isLink: false,
		children: [],
		parent: parent?.id,
		depth
	};
	folders[soapFolder.id] = folder;
	soapFolder?.folder?.forEach((f) => {
		if (!hasId(f, IM_LOGS)) {
			const child = processFolder(f, depth + 1, folder);
			if (!hasId(f, USER_ROOT)) {
				folder.children.push(child);
			}
		}
	});
	soapFolder?.link?.forEach((l) => {
		if (!hasId(l, IM_LOGS)) {
			const child = processLink(l, depth + 1, folder);
			if (!hasId(l, USER_ROOT)) {
				folder.children.push(child);
			}
		}
	});
	soapFolder?.search?.forEach((s) => {
		processSearch(s, folder);
	});
	return folder;
};

export const handleFolderRefresh = (
	soapFolders: Array<SoapFolder>,
	currentView: FolderView
): UserFolder | Array<UserFolder> => {
	view = currentView;
	if (soapFolders.length > 1) {
		const sharedAccounts = soapFolders.slice(1);
		return [
			processFolder(soapFolders[0], 0),
			...sharedAccounts.map((folder) => processLink(folder as SoapLink, 0))
		] as Array<UserFolder>;
	}
	return processFolder(soapFolders[0], 0);
};

export const handleFolderCreated = (created: Array<SoapFolder>): void =>
	created.forEach((val: SoapFolder) => {
		if (val.id && val.l && view && val.view === view) {
			const parent = folders[val.l];
			const folder: UserFolder = {
				...normalize(val, parent),
				isLink: false,
				children: [],
				parent: parent?.id,
				depth: parent && parent.depth !== undefined ? parent.depth + 1 : 0
			};
			folders[val.id] = folder;
			parent.children.push(folder);
			sortFoldersByName(parent.children);
		}
	});
export const handleLinkCreated = (created: Array<SoapLink>): void =>
	created.forEach((val: SoapLink) => {
		if (val.id && val.l && view && val.view === view) {
			const parent = folders[val.l];
			const folder: LinkFolder = {
				...normalizeLink(val, parent),
				isLink: true,
				children: [],
				parent: parent?.id,
				depth: parent && parent.depth !== undefined ? parent.depth + 1 : 0
			};
			folders[val.id] = folder;
			parent.children.push(folder);
			sortFoldersByName(parent.children);
		}
	});

function getKeyByValue(map: Folders, searchValue: Partial<UserFolder>): string | undefined {
	return Object.keys(map).find(
		(key) => searchValue.id === `${(map[key] as LinkFolder).zid}:${(map[key] as LinkFolder).rid}`
	);
}

function folderIsSharedWithMe(folderId: string | undefined): boolean {
	if (!folderId) return false;
	const folder = folders[folderId];
	if (folder?.parent) {
		return folderIsSharedWithMe(folder?.parent);
	}
	return folder?.name === 'USER_ROOT';
}

export const handleFolderModified = (modified: Array<Partial<UserFolder>>): void =>
	// the type defined in shell is not correct refs: SHELL-118
	// FIXME: remove the ts-ignore when the type will be fixed
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	modified.forEach((val: Partial<SoapFolder>): void => {
		if (!val.id) return;
		const mountPointId = val.id.includes(':') ? val.id : getKeyByValue(folders, val);
		const parentMountPointId = getKeyByValue(folders, { id: val.l });
		const isSharedWithMe = folderIsSharedWithMe(mountPointId);
		const parentIsSharedWithMe = folderIsSharedWithMe(parentMountPointId);
		const parentFolderId = parentIsSharedWithMe && parentMountPointId ? parentMountPointId : val.l;
		const folderId = isSharedWithMe && mountPointId ? mountPointId : val.id;
		const folder = folderId ? folders[folderId] : null;

		if (folder) {
			Object.assign(folder, omit({ ...val, id: folderId }));
			updateChildren(folder, val);
			if (typeof val.f !== 'undefined') {
				folder.checked = testFolderIsChecked({ string: val.f });
			}

			const oldParentId = folder.parent;

			if (oldParentId) {
				const oldParent = folders[oldParentId];
				if (oldParent) {
					if (!val.l) {
						oldParent.children = oldParent.children.map((f) => (f.id !== val.id ? f : folder));
					} else {
						const newParent = parentFolderId ? folders[parentFolderId] : null;
						if (newParent) {
							oldParent.children = oldParent.children.filter((f) => f.id !== folderId);
							newParent.children.push(folder);
							sortFoldersByName(newParent.children);
							folder.parent = newParent.id;
							folder.depth = newParent?.depth !== undefined ? newParent.depth + 1 : 0;
						}
					}
				}
				folders[folderId] = folder;
			}
		}
	});
export const handleFolderDeleted = (deleted: string[]): void =>
	deleted.forEach((val) => {
		const folder = folders[val];
		if (folder) {
			if (folder.parent) {
				const parent = folders[folder.parent];
				parent.children = parent.children.filter((obj) => obj.id !== val);
			}
			delete folders[val];
			delete searches[val];
		}
	});
export const handleFolderNotify = (notify: SoapNotify): void => {
	handleFolderCreated(notify.created?.folder ?? []);
	handleLinkCreated(notify.created?.link ?? []);
	// the type defined in shell is not correct refs: SHELL-118
	// FIXME: remove the ts-ignore when the type will be fixed
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	handleFolderModified([...(notify.modified?.folder ?? []), ...(notify.modified?.link ?? [])]);
	handleFolderDeleted(notify.deleted ?? []);
};

export const handleFoldersMessages = ({ data }: FolderMessage): void => {
	if (data.op === 'refresh' && data.folder) {
		handleFolderRefresh(data.folder, data.currentView);
	}
	if (data.op === 'notify') {
		handleFolderNotify(data.notify);
	}
};

export const handleMessage = ({ data }: FolderMessage): void => {
	handleFoldersMessages({ data });
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	postMessage({ folders, linksIdMap, searches });
};
