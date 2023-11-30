/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement, useMemo } from 'react';

import {
	act,
	ByRoleMatcher,
	ByRoleOptions,
	GetAllBy,
	queries,
	queryHelpers,
	render,
	RenderOptions,
	RenderResult,
	Screen,
	screen as rtlScreen,
	within as rtlWithin
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { ModalManager, SnackbarManager, ThemeProvider } from '@zextras/carbonio-design-system';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { Store } from 'redux';

import I18nTestFactory from './i18n/i18n-test-factory';
import { previewContextMock, PreviewsManagerContext } from './mocks/carbonio-ui-preview';

type ByRoleWithIconOptions = ByRoleOptions & {
	icon: string | RegExp;
};

/**
 * Matcher function to search an icon button through the icon data-testid
 */
const queryAllByRoleWithIcon: GetAllBy<[ByRoleMatcher, ByRoleWithIconOptions]> = (
	container,
	role,
	{ icon, ...options }
) =>
	rtlWithin(container)
		.queryAllByRole(role, options)
		.filter((element) => rtlWithin(element).queryByTestId(icon) !== null);
const getByRoleWithIconMultipleError = (
	_container: Element | null,
	role: ByRoleMatcher,
	options: ByRoleWithIconOptions
): string => `Found multiple elements with role ${role} and icon ${options.icon}`;
const getByRoleWithIconMissingError = (
	_container: Element | null,
	role: ByRoleMatcher,
	options: ByRoleWithIconOptions
): string => `Unable to find an element with role ${role} and icon ${options.icon}`;

const [
	queryByRoleWithIcon,
	getAllByRoleWithIcon,
	getByRoleWithIcon,
	findAllByRoleWithIcon,
	findByRoleWithIcon
] = queryHelpers.buildQueries<[ByRoleMatcher, ByRoleWithIconOptions]>(
	queryAllByRoleWithIcon,
	getByRoleWithIconMultipleError,
	getByRoleWithIconMissingError
);

const customQueries = {
	queryByRoleWithIcon,
	getAllByRoleWithIcon,
	getByRoleWithIcon,
	findAllByRoleWithIcon,
	findByRoleWithIcon
};

const queriesExtended = { ...queries, ...customQueries };

export function within(
	element: Parameters<typeof rtlWithin<typeof queriesExtended>>[0]
): ReturnType<typeof rtlWithin<typeof queriesExtended>> {
	return rtlWithin(element, queriesExtended);
}

export const screen: Screen<typeof queriesExtended> = { ...rtlScreen, ...within(document.body) };

interface ProvidersWrapperProps {
	children?: React.ReactElement;
	options?: any;
}

const StoreProvider = ({ store, children }: { store: Store; children: JSX.Element }): JSX.Element =>
	store ? <Provider store={store}>{children}</Provider> : children;

export const ProvidersWrapper = ({
	children,
	options = {}
}: ProvidersWrapperProps): JSX.Element => {
	const { store, initialEntries = ['/'], path = '/' } = options;

	const i18n = useMemo(() => {
		const i18nFactory = new I18nTestFactory();
		return i18nFactory.getAppI18n();
	}, []);

	return (
		<ThemeProvider>
			<MemoryRouter
				initialEntries={initialEntries}
				initialIndex={(initialEntries?.length || 1) - 1}
			>
				<Route path={path}>
					<StoreProvider store={store}>
						<I18nextProvider i18n={i18n}>
							<SnackbarManager>
								<PreviewsManagerContext.Provider value={previewContextMock}>
									<ModalManager>{children}</ModalManager>
								</PreviewsManagerContext.Provider>
							</SnackbarManager>
						</I18nextProvider>
					</StoreProvider>
				</Route>
			</MemoryRouter>
		</ThemeProvider>
	);
};

function customRender(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, 'queries' | 'wrapper'>
): RenderResult {
	const Wrapper = ({ children }: ProvidersWrapperProps): React.JSX.Element => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	return render(ui, {
		wrapper: Wrapper,
		queries: { ...queries, ...customQueries },
		...options
	});
}

type SetupOptions = {
	renderOptions?: Omit<RenderOptions, 'queries'>;
	setupOptions?: Parameters<(typeof userEvent)['setup']>[0];
};

export function setupTest(
	ui: ReactElement,
	options?: SetupOptions
): { user: ReturnType<(typeof userEvent)['setup']> } & ReturnType<typeof render> {
	return {
		user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime, ...options?.setupOptions }),
		...customRender(ui, options?.renderOptions)
	};
}

type Options = {
	initialEntries?: Array<string>;
	initialProps?: any;
	path?: string;
	store?: Store;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupHook(hook: any, options: Options = {}): any {
	const Wrapper = ({ children }: ProvidersWrapperProps): React.JSX.Element => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	const { initialProps = [] } = options;
	const { result, unmount, rerender } = renderHook((props) => hook(...props), {
		wrapper: Wrapper,
		initialProps
	});

	return { result, unmount, rerender };
}

export function makeListItemsVisible(): void {
	const { calls, instances } = (
		window.IntersectionObserver as jest.Mock<
			IntersectionObserver,
			[callback: IntersectionObserverCallback, options?: IntersectionObserverInit]
		>
	).mock;
	calls.forEach((call, index) => {
		const [onChange] = call;
		// trigger the intersection on the observed element
		act(() => {
			onChange(
				[
					{
						intersectionRatio: 0,
						isIntersecting: true
					} as IntersectionObserverEntry
				],
				instances[index]
			);
		});
	});
}
