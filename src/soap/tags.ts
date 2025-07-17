/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { legacySoapFetch, SoapBody } from '@zextras/carbonio-ui-soap-lib';

import { Tag } from '../types/tags';

export type CreateTagRequest = SoapBody<{
	tag: Omit<Tag, 'id'>;
}>;

export type CreateTagResponse = SoapBody<{
	tag: [Tag];
}>;

export type TagActionRequest = SoapBody<{
	action: {
		op: 'rename' | 'color' | 'delete' | 'update';
		id: string;
		name?: string;
		color?: number;
		rgb?: string;
	};
}>;

export type TagActionResponse = {
	action: { op: string; id: string };
};

export const createTag = (tag: Omit<Tag, 'id'>): Promise<CreateTagResponse> =>
	legacySoapFetch<CreateTagRequest, CreateTagResponse>('CreateTag', {
		_jsns: 'urn:zimbraMail',
		tag
	});

export const deleteTag = (id: string): Promise<TagActionResponse> =>
	legacySoapFetch<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'delete', id }
	});

export const renameTag = (id: string, name: string): Promise<TagActionResponse> =>
	legacySoapFetch<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'rename', id, name }
	});

export const changeTagColor = (id: string, color: string | number): Promise<TagActionResponse> =>
	legacySoapFetch<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: typeof color === 'number' ? { op: 'color', color, id } : { op: 'color', rgb: color, id }
	});
