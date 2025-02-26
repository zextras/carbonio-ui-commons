/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

export type HistoryNavigation = {
	replaceHistory: (path: string) => void;
	pushHistory: (path: string) => void;
};

export const useHistoryNavigation = (): HistoryNavigation => {
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

	return useMemo<HistoryNavigation>(
		() => ({
			replaceHistory,
			pushHistory
		}),
		[replaceHistory, pushHistory]
	);
};
