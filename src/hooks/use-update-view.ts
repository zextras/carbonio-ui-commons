/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useEffect } from 'react';

import { NoOp } from '../soap/no-op';

export const useUpdateView = (): void => {
	const handler = useCallback((): void => {
		NoOp();
	}, []);

	useEffect((): (() => void) => {
		window.addEventListener('updateView', handler);
		return function cleanup() {
			window.removeEventListener('updateView', handler);
		};
	}, [handler]);
};
