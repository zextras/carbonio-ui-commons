/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { ChipInput, ChipItem } from '@zextras/carbonio-design-system';

import { USER_TYPES_CONST } from './constants';
import { ContactInputItem, ContactInputProps, UserOrDL } from './types';
import { parseEmail } from '../helpers/email-parser';

export const DefaultContactInput = ({
	onChange,
	defaultValue,
	...rest
}: ContactInputProps): React.JSX.Element => {
	const internalOnChange = (items: ChipItem<UserOrDL>[]): void => {
		onChange?.(items as Array<ContactInputItem>);
	};
	const internalOnAdd = (email: unknown): ContactInputItem => {
		if (typeof email === 'string') {
			const validEmail = parseEmail(email);
			const finalEmail = validEmail ?? email;
			return {
				id: finalEmail,
				label: finalEmail,
				value: {
					id: finalEmail,
					email,
					type: USER_TYPES_CONST.CONTACT
				},
				error: !validEmail
			};
		}
		throw new Error('no value');
	};
	return (
		<ChipInput<UserOrDL>
			{...rest}
			pasteSeparators={[',', ';', '\n']}
			createChipOnPaste
			separators={[
				{ code: 'Enter', ctrlKey: false },
				{ code: 'NumpadEnter', ctrlKey: false },
				{ key: ',', ctrlKey: false },
				{ key: ';', ctrlKey: false }
			]}
			onChange={internalOnChange}
			onAdd={internalOnAdd}
		></ChipInput>
	);
};
