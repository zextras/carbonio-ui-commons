/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import { create } from 'zustand';

import { CalendarGroups, Folder, FolderState } from '../../../types';
import { folderWorker } from '../../../worker';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useFolderStore = create<FolderState>()((set) => ({
	folders: {},
	linksIdMap: {},
	searches: {},
	groups: [],
	updateFolder: (id: string, opt: Partial<Folder>): void => {
		set(
			produce((state) => {
				if (state?.folders?.[id]) {
					state.folders[id] = {
						...state.folders[id],
						...opt
					};
				}
			})
		);
	},
	updateGroups: (groups: CalendarGroups): void => {
		set(
			produce((state) => {
				state.groups = groups;
			})
		);
	}
}));

folderWorker.onmessage = ({ data }): void => {
	useFolderStore.setState(data);
};
