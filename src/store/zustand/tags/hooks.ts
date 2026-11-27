/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { pick } from 'lodash';

import { useTagStore } from './store';
import { sortTagsByName } from '../../../helpers/tags';
import { Tag, Tags } from '../../../types/tags';

function sortTags(tags: Tags): Array<Tag> {
	return sortTagsByName(Object.values(tags));
}

export const useTags = (ids?: Array<string> | string): Tags =>
	useTagStore((state) => (ids ? pick(state.tags, ids) : state.tags));

export const getTags = (ids?: Array<string> | string): Tags =>
	ids ? pick(useTagStore.getState().tags, ids) : useTagStore.getState().tags;

export const useSortedTagsArray = (): Array<Tag> =>
	useTagStore((state): Array<Tag> => sortTags(state.tags));
