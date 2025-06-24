/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

export type FolderAction = {
	id: string;
	icon: string;
	label: string;
	onClick: (ev: React.SyntheticEvent) => void;
	disabled?: boolean;
};
