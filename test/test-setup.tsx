/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { Reducer, useMemo } from 'react';

import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalManager, ThemeProvider, SnackbarManager } from '@zextras/carbonio-design-system';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import I18nTestFactory from './i18n/i18n-test-factory';

interface ProvidersWrapperProps {
	children?: React.ReactElement;
}

function customRender(ui: React.ReactElement, options?: any): RenderResult {
	const ProvidersWrapper = ({ children }: ProvidersWrapperProps): JSX.Element => {
		const i18n = useMemo(() => {
			const i18nFactory = new I18nTestFactory();
			return i18nFactory.getAppI18n();
		}, []);

		const store = options?.store ?? {};

		return (
			<ThemeProvider>
				<Provider store={store}>
					<I18nextProvider i18n={i18n}>
						<SnackbarManager>
							<ModalManager>{children}</ModalManager>
						</SnackbarManager>
					</I18nextProvider>
				</Provider>
			</ThemeProvider>
		);
	};

	return render(ui, {
		wrapper: ProvidersWrapper,
		...options
	});
}

export function setupTest(
	...args: Parameters<typeof customRender>
): { user: ReturnType<typeof userEvent['setup']> } & ReturnType<typeof render> {
	return {
		user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
		...customRender(...args)
	};
}
