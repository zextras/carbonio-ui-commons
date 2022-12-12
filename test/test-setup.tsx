/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalManager, ThemeProvider, SnackbarManager } from '@zextras/carbonio-design-system';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { Store } from 'redux';
import I18nTestFactory from './i18n/i18n-test-factory';
import { previewContextMock, PreviewsManagerContext } from './mocks/carbonio-ui-preview';

interface ProvidersWrapperProps {
	children?: React.ReactElement;
	options?: any;
}

export const ProvidersWrapper = ({ children, options }: ProvidersWrapperProps): JSX.Element => {
	const { store = {}, initialEntries = ['/'], path = '/' } = options;

	const i18n = useMemo(() => {
		const i18nFactory = new I18nTestFactory();
		return i18nFactory.getAppI18n();
	}, []);

	return (
		<ThemeProvider>
			<MemoryRouter initialEntries={initialEntries}>
				<Route path={path}>
					<Provider store={store}>
						<I18nextProvider i18n={i18n}>
							<SnackbarManager>
								<PreviewsManagerContext.Provider value={previewContextMock}>
									<ModalManager>{children}</ModalManager>
								</PreviewsManagerContext.Provider>
							</SnackbarManager>
						</I18nextProvider>
					</Provider>
				</Route>
			</MemoryRouter>
		</ThemeProvider>
	);
};

function customRender(ui: React.ReactElement, options: any): RenderResult {
	const Wrapper = ({ children }: ProvidersWrapperProps): JSX.Element => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	return render(ui, {
		wrapper: Wrapper,
		...options
	});
}

// function customRender(ui: React.ReactElement, options?: any): RenderResult {
// 	const ProvidersWrapper = ({ children }: ProvidersWrapperProps): JSX.Element => {
// 		const { store = {}, initialEntries = ['/'], path = '/' } = options;
//
// 		const i18n = useMemo(() => {
// 			const i18nFactory = new I18nTestFactory();
// 			return i18nFactory.getAppI18n();
// 		}, []);
//
// 		return (
// 			<ThemeProvider>
// 				<Provider store={store}>
// 					<I18nextProvider i18n={i18n}>
// 						<SnackbarManager>
// 							<PreviewsManagerContext.Provider value={previewContextMock}>
// 								<ModalManager>{children}</ModalManager>
// 							</PreviewsManagerContext.Provider>
// 						</SnackbarManager>
// 					</I18nextProvider>
// 				</Provider>
// 			</ThemeProvider>
// 		);
// 	};
//
// 	return render(ui, {
// 		wrapper: ProvidersWrapper,
// 		...options
// 	});
// }

export function setupTest(
	...args: Parameters<typeof customRender>
): { user: ReturnType<typeof userEvent['setup']> } & ReturnType<typeof render> {
	return {
		user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
		...customRender(...args)
	};
}

type Options = {
	initialEntries?: Array<string>;
	path?: string;
	store?: Store;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupHook(hook: any, options: Options = {}): any {
	const Wrapper = ({ children }: ProvidersWrapperProps): JSX.Element => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	const { result, unmount } = renderHook(() => hook, { wrapper: Wrapper });

	return { result, unmount };
}
