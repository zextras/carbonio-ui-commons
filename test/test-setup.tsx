/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalManager, ThemeProvider, SnackbarManager } from '@zextras/carbonio-design-system';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import I18nTestFactory from './i18n/i18n-test-factory';

interface ProvidersWrapperProps {
	children?: React.ReactElement;
	options?: any;
}

const ProvidersWrapper = ({ children, options }: ProvidersWrapperProps): JSX.Element => {
	const { store = {} } = options;

	const i18n = useMemo(() => {
		const i18nFactory = new I18nTestFactory();
		return i18nFactory.getAppI18n();
	}, []);

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

function customRender(
	ui: React.ReactElement,
	{ initialEntries = ['/'], path = '*', ...options }: any
): RenderResult {
	const Wrapper = ({ children }: ProvidersWrapperProps): JSX.Element => (
		<MemoryRouter initialEntries={initialEntries}>
			<Route path={path}>
				<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
			</Route>
		</MemoryRouter>
	);
	return render(ui, {
		wrapper: Wrapper,
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
