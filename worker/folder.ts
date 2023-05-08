/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type {
	FolderMessage,
	SoapFolder,
	SoapLink,
	SoapNotify,
	SoapSearchFolder
} from '@zextras/carbonio-shell-ui';
import type {
	BaseFolder,
	Folder,
	Folders,
	LinkFolder,
	LinkFolderFields,
	Searches,
	SearchFolderFields,
	UserFolder
} from '../types/folder';

const IM_LOGS = '14';

const folders: Folders = {};
const searches: Searches = {};

export const testFolderIsChecked = ({ string }: { string: string | undefined }): boolean =>
	/#/.test(string || '');

export const omit = (
	folder: Partial<SoapFolder> = {},
	propToOmit: Array<keyof Partial<SoapFolder>> = []
): Partial<SoapFolder> => {
	const keysToOmit = structuredClone(folder);
	propToOmit.forEach((key) => {
		delete keysToOmit[key];
	});
	return keysToOmit;
};

export const hasId = (f: SoapFolder, id: string): boolean => f.id.split(':').includes(id);
export const normalize = (f: SoapFolder, p?: Folder): BaseFolder => ({
	id: f.id,
	uuid: f.uuid,
	name: f.name,
	absFolderPath: f.absFolderPath,
	l: f.l,
	luuid: f.luuid,
	checked: testFolderIsChecked({ string: f.f }),
	f: f.f,
	// the type defined in shell is not correct
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
			folder.children.push(child);
		}
	});
	soapFolder?.link?.forEach((l) => {
		if (!hasId(l, IM_LOGS)) {
			const child = processLink(l, depth + 1, folder);
			folder.children.push(child);
		}
	});
	soapFolder?.search?.forEach((s) => {
		processSearch(s, folder);
	});
	return folder;
};

export const handleFolderRefresh = (soapFolders: Array<SoapFolder>): UserFolder =>
	processFolder(soapFolders[0], 0);

export const handleFolderCreated = (created: Array<SoapFolder>): void =>
	created.forEach((val: SoapFolder) => {
		if (val.id && val.l) {
			const parent = folders[val.l];
			const folder: UserFolder = {
				...normalize(val, parent),
				isLink: false,
				children: [],
				parent: parent?.id,
				depth: parent?.depth ? parent.depth + 1 : 0
			};
			folders[val.id] = folder;
			parent.children.push(folder);
		}
	});
export const handleLinkCreated = (created: Array<SoapLink>): void =>
	created.forEach((val: SoapLink) => {
		if (val.id && val.l) {
			const parent = folders[val.l];
			const folder: LinkFolder = {
				...normalizeLink(val, parent),
				isLink: true,
				children: [],
				parent: parent?.id,
				depth: parent?.depth ? parent.depth + 1 : 0
			};
			folders[val.id] = folder;
			parent.children.push(folder);
		}
	});
export const handleFolderModified = (modified: Array<Partial<UserFolder>>): void =>
	// the type defined in shell is not correct
	// FIXME: remove the ts-ignore when the type will be fixed
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	modified.forEach((val: Partial<SoapFolder>): void => {
		if (val.id) {
			const folder = folders[val.id];
			if (folder) {
				Object.assign(folder, omit(val, ['link', 'folder', 'search']));
				if (typeof val.f !== 'undefined') {
					folder.checked = testFolderIsChecked({ string: val.f });
				}
				if (val.l) {
					const oldParentId = folders[val.id].parent;
					if (oldParentId) {
						const oldParent = folders[oldParentId];
						const newParent = folders[val.l];
						if (oldParent) {
							oldParent.children = oldParent.children.filter((f) => f.id !== val.id);
							newParent.children.push(folder);
						}
						folder.parent = newParent.id;
					}
				}
				folders[val.id] = folder;
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
	// the type defined in shell is not correct
	// FIXME: remove the ts-ignore when the type will be fixed
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	handleFolderModified([...(notify.modified?.folder ?? []), ...(notify.modified?.link ?? [])]);
	handleFolderDeleted(notify.deleted ?? []);
};

onmessage = ({ data }: FolderMessage): void => {
	if (data.op === 'refresh' && data.folder) {
		handleFolderRefresh(data.folder);
	}
	if (data.op === 'notify') {
		handleFolderNotify(data.notify);
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	postMessage({ folders, searches });
};
