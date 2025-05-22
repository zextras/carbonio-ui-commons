/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { create } from 'zustand';

import { TagState } from '../../../types/tags';
import { tagsWorker } from '../../../worker';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useTagStore = create<TagState>()(() => ({
	tags: {}
}));

tagsWorker.onmessage = ({ data }): void => {
	useTagStore.setState(data);
};
