/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipInputProps, ChipItem } from '@zextras/carbonio-design-system';

type RequiredEmailLabelChipItem<T> = Required<Pick<ChipItem<T>, 'value'>> &
	Required<Pick<ChipItem<T>, 'label'>> &
	Omit<ChipItem<T>, 'label' | 'value'>;

export type USER_TYPES = {
	GROUP: 'CONTACT_GROUP';
	DISTRIBUTION_LIST: 'DISTRIBUTION_LIST';
	CONTACT: 'CONTACT';
};

export type UserContact = {
	id: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	fullName?: string;
	company?: string;
	email: string;
	type: USER_TYPES['CONTACT'];
};

export type UserDistributionList = {
	id: string;
	email: string;
	type: USER_TYPES['DISTRIBUTION_LIST'];
};

export type UserOrDL = UserContact | UserDistributionList;

export type ContactInputItem = RequiredEmailLabelChipItem<UserOrDL>;

export type ContactInputOnChange = ((items: ContactInputItem[]) => void) | undefined;

export type ContactInputProps = Pick<
	ChipInputProps,
	| 'icon'
	| 'iconAction'
	| 'placeholder'
	| 'background'
	| 'iconDisabled'
	| 'description'
	| 'hasError'
	| 'inputRef'
	| 'disabled'
> & {
	onChange?: ContactInputOnChange;
	defaultValue: Array<ContactInputItem>;
	dragAndDropEnabled?: boolean;
	orderedAccountIds?: Array<string>;
};
