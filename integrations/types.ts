/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipInputProps, ChipItem } from '@zextras/carbonio-design-system';

type RequiredEmailLabelChipItem<T> = Required<Pick<ChipItem<T>, 'value'>> &
	Required<Pick<ChipItem<T>, 'label'>> &
	Omit<ChipItem<T>, 'label' | 'value'>;

export type ContactType = {
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
	type: ContactType['CONTACT'];
};

export type DistributionListContact = {
	id: string;
	email: string;
	type: ContactType['DISTRIBUTION_LIST'];
};

export type GroupContact = {
	id: string;
	display: string;
	groupId: string;
	type: ContactType['GROUP'];
};

export type UserOrDL = UserContact | DistributionListContact;
export type ContactInputItem = RequiredEmailLabelChipItem<UserOrDL>;

export type ContactInputValue = Array<ContactInputItem>;

export type ContactInputOnChange = ((items: ContactInputItem[]) => void) | undefined;

export type ContactInputItemInternalValue = GroupContact | DistributionListContact | UserContact;

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
	| 'maxChips'
> & {
	onChange?: ContactInputOnChange;
	defaultValue: Array<ContactInputItem>;
	dragAndDropEnabled?: boolean;
	orderedAccountIds?: Array<string>;
	labelFactory?: (value: ContactInputItemInternalValue, defaultLabel: string) => string;
};
