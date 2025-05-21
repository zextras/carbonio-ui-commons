/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect } from 'react';

import { addRoute, upsertApp } from '@zextras/carbonio-shell-ui';

const App = (): React.JSX.Element => {
	const MAIL_APP_ID = 'carbonio-mails-ui';
	const MAILS_ROUTE = 'mails';

	useEffect(() => {
		addRoute({
			route: MAILS_ROUTE,
			position: 1000,
			visible: false
		});
	}, []);

	useEffect(() => {
		upsertApp({
			name: MAIL_APP_ID,
			display: ''
		});
	}, []);
	return <></>;
};

export default App;
