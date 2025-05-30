/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ComponentType, SyntheticEvent } from 'react';

import { WorkerMessage } from '../workers';

export type Tag = {
	color?: number;
	id: string;
	name: string;
	rgb?: string;
	u?: number;
	n?: number;
};

export type Tags = Record<string, Tag>;

export type TagState = {
	tags: Tags;
};

export type ReturnType = {
	id: string;
	icon: string;
	label: string;
	click?: (arg: React.SyntheticEvent<HTMLElement, Event> | KeyboardEvent) => void;
	items?: Array<{
		customComponent: ComponentType;
		id: string;
		icon: string;
		label: string;
	}>;
};

export type TagsFromStoreType = Record<string, Tag>;

export type ArgumentType = {
	createModal?: (...args: any) => () => void;
	createSnackbar?: (...args: any) => void;
	items?: ReturnType;
	tag?: ItemType;
};

export type ItemType = any;

export type TagsAccordionItems = {
	items: ItemType[];
	id: string;
	label: string;
	active: false;
	open: boolean;
	onClick: (e: SyntheticEvent<Element, Event> | KeyboardEvent) => void;
	CustomComponent: ComponentType<any>;
};

export type TagMessage = WorkerMessage<{ state: Tags }>;
