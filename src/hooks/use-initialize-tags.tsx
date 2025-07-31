/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect, useState } from 'react';

import { useInfoRefresh } from '@zextras/carbonio-ui-soap-lib';
import { isEmpty } from 'lodash';

import { tagsWorker } from '../worker';

export const useInitializeTags = (): void => {
	const [initialized, setInitialized] = useState(false);
	const refresh = useInfoRefresh();
	useEffect(() => {
		if (!isEmpty(refresh) && !initialized) {
			setInitialized(true);
			tagsWorker.postMessage({
				op: 'refresh',
				tags: refresh.tags
			});
		}
	}, [initialized, refresh]);
};
