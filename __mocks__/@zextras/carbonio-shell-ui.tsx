/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type * as shell from '@zextras/carbonio-shell-ui';
import { useActions as realUseActions } from '@zextras/carbonio-shell-ui';

import { Mock } from 'vitest';
import { generateAccount } from '../../src/__test__/mocks/accounts/account-generator';
import { generateSettings } from '../../src/__test__/mocks/settings/settings-generator';
import { FC, ReactNode } from 'react';

export const useAuthenticated: Mock<typeof shell.useAuthenticated> = vi.fn(() => true);

export const mockedAccount = generateAccount();
const mockedAccounts = [mockedAccount];
const mockedSettings = generateSettings();

export const getUserAccount: Mock<typeof shell.getUserAccount> = vi.fn(() => mockedAccount);
export const useUserAccount: Mock<typeof shell.useUserAccount> = vi.fn(() => mockedAccount);
export const useUserAccounts: Mock<typeof shell.useUserAccounts> = vi.fn(() => mockedAccounts);

export const useUserSettings = vi.fn(() => mockedSettings);
export const getUserSettings = vi.fn(() => mockedSettings);
export const t = vi.fn((key: string) => key);
export const replaceHistory = vi.fn();
export const pushHistory = vi.fn();

export const useBoard = vi.fn();

export const useAppContext: Mock<typeof shell.useAppContext> = vi.fn(() => mockedAccounts);
export const setAppContext = vi.fn();
export const getBridgedFunctions = vi.fn();
export const addBoard = vi.fn();
export const closeBoard = vi.fn();
export const updateBoardContext = vi.fn();
export const useBoardHooks = vi.fn().mockReturnValue({
	closeBoard: vi.fn(),
	updateBoard: vi.fn(),
	setCurrentBoard: vi.fn(),
	getBoardContext: vi.fn(),
	getBoard: vi.fn()
});
export const minimizeBoards = vi.fn();
export const getCurrentRoute = vi.fn();
export const useIsCarbonioCE: Mock<typeof shell.useIsCarbonioCE> = vi.fn(() => false);

export const useLocalStorage = vi.fn();
export const AppLink: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const editSettings = vi.fn(() => Promise.resolve({ data: {} }));
export const registerComponents: typeof shell.registerComponents = vi.fn();
export const registerActions: typeof shell.registerActions = vi.fn();
export const addRoute: typeof shell.addRoute = vi.fn();
export const removeRoute: typeof shell.removeRoute = vi.fn();
export const addSettingsView: typeof shell.addSettingsView = vi.fn();
export const addBoardView: typeof shell.addBoardView = vi.fn();
export const getBoardById: typeof shell.getBoardById = vi.fn();
export const setCurrentBoard: typeof shell.setCurrentBoard = vi.fn();
export const reopenBoards: typeof shell.reopenBoards = vi.fn();
export const registerFunctions: typeof shell.registerFunctions = vi.fn();
export const upsertApp: typeof shell.upsertApp = vi.fn();

/*
 * Integration mocks
 */
// Integrated components
const FakeIntegrationComponent = (): React.JSX.Element => <div data-testid="fake-component" />;
const IntegrationComponent = vi.fn(FakeIntegrationComponent);
const isIntegrationAvailable = false;
export const useIntegratedComponent = vi.fn((_id: string) => [
	IntegrationComponent,
	isIntegrationAvailable
]);
export const getIntegratedComponent = vi.fn((_id: string) => [
	IntegrationComponent,
	isIntegrationAvailable
]);

// Integrated actions
export const getAction = vi.fn<typeof shell.getAction>((type, id) => [undefined, false]);

export const useActions = vi.fn<typeof realUseActions>().mockImplementation(() => []);

// Integrated functions
export const getIntegratedFunction = vi.fn(
	(_id: Parameters<typeof shell.getIntegratedFunction>[0]) =>
		[vi.fn(), false] as ReturnType<typeof shell.getIntegratedFunction>
);

export const useIntegratedFunction = vi.fn(
	(_id: Parameters<typeof shell.useIntegratedFunction>[0]) =>
		[vi.fn(), false] as ReturnType<typeof shell.useIntegratedFunction>
);
