/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

type Navigation = {
	replaceHistory: (path: string) => void;
	pushHistory: (path: string) => void;
};

export const useNavigation = (): Navigation => {
	const navigate = useNavigate();

	const replaceHistory = useCallback(
		(path: string): void => {
			navigate(path, { replace: true });
		},
		[navigate]
	);

	const pushHistory = useCallback(
		(path: string): void => {
			navigate(path, { replace: false });
		},
		[navigate]
	);

	return useMemo<Navigation>(
		() => ({
			replaceHistory,
			pushHistory
		}),
		[replaceHistory, pushHistory]
	);
};
