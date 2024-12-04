/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { FC } from 'react';

import { useIntegratedComponent } from '@zextras/carbonio-shell-ui';

import { DefaultContactInput } from './default-contact-input';
import { ContactInputProps } from './types';

export const useContactInput = (): FC<ContactInputProps> => {
	const [ContactInput, integrationAvailable] = useIntegratedComponent('contact-input');
	if (integrationAvailable) {
		return ContactInput;
	}
	return DefaultContactInput;
};
