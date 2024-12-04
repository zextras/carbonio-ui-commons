/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { ChipInput, ChipItem } from '@zextras/carbonio-design-system';

import { USER_TYPES_CONST } from './constants';
import { ContactInputItem, ContactInputProps, UserOrDL } from './types';

export const DefaultContactInput = ({
	onChange,
	...rest
}: ContactInputProps): React.JSX.Element => {
	const internalOnChange = (items: ChipItem<UserOrDL>[]): void => {
		onChange?.(items as Array<ContactInputItem>);
	};
	const internalOnAdd = (email: unknown): ContactInputItem => {
		if (typeof email === 'string') {
			return {
				id: email,
				label: email,
				value: {
					id: email,
					email,
					type: USER_TYPES_CONST.CONTACT
				}
			};
		}
		throw new Error('no value');
	};
	return (
		<ChipInput<UserOrDL> {...rest} onChange={internalOnChange} onAdd={internalOnAdd}></ChipInput>
	);
};
