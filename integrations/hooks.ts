/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { FC } from 'react';

import { useIntegratedComponent } from '@zextras/carbonio-shell-ui';

import { ContactInputProps } from './types';

export const useContactInput = (): [FC<ContactInputProps>, boolean] => {
	const [ContactInput, integrationAvailable] = useIntegratedComponent('contact-input');
	return [ContactInput as FC<ContactInputProps>, integrationAvailable];
};
