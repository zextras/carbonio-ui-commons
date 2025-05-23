/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { ChipInput, ChipItem } from '@zextras/carbonio-design-system';

import { CONTACT_TYPES } from './constants';
import { ContactInputItem, ContactInputProps, UserOrDL } from './types';
import { parseEmail } from '../helpers/email-parser';

export const DefaultContactInput = ({
	onChange,
	defaultValue,
	// The following props are not used in this component, but are passed to the ChipInput component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	dragAndDropEnabled: _dragAndDropEnabled,
	// The following props are not used in this component, but are passed to the ChipInput component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	orderedAccountIds: _orderedAccountIds,
	// The following props are not used in this component, but are passed to the ChipInput component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	labelFactory: _labelFactory,
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
					type: CONTACT_TYPES.CONTACT
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
			defaultValue={defaultValue}
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
