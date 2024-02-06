/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, ReactNode, useCallback } from 'react';

import { Action } from '@zextras/carbonio-design-system';
import shell, { HistoryParams } from '@zextras/carbonio-shell-ui';
import { trimStart } from 'lodash';
import { useHistory } from 'react-router-dom';

import { generateAccount } from './accounts/account-generator';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';
import { tags } from './tags/tags';

export { FOLDERS, ZIMBRA_STANDARD_COLORS, JSNS } from './carbonio-shell-ui-constants';

export const mockedAccount = generateAccount();
const mockedAccounts = [mockedAccount];
const mockedSettings = generateSettings();
const mockedTags: shell.Tags = tags;

export const getUserAccount: typeof shell.getUserAccount = () => mockedAccount;
export const useUserAccount: typeof shell.useUserAccount = () => mockedAccount;
export const useUserAccounts: typeof shell.useUserAccounts = () => mockedAccounts;
export const useUserSettings = jest.fn(() => mockedSettings);
export const getUserSettings = jest.fn(() => mockedSettings);
export const t = jest.fn((key: string) => key);
export const replaceHistory = jest.fn();
export const pushHistory = jest.fn();

export const useBoard = jest.fn();

export const useAppContext = jest.fn<unknown, []>(() => mockedAccounts);
export const getBridgedFunctions = jest.fn();
export const addBoard = jest.fn();
export const useBoardHooks = jest.fn();
export const minimizeBoards = jest.fn();
export const getCurrentRoute = jest.fn();
export const useTags = jest.fn(() => mockedTags);
export const getTags = jest.fn(() => mockedTags);
export const useTag = jest.fn((id: string) => mockedTags[id]);
export const getTag = jest.fn((id: string) => mockedTags[id]);

export * from './network/fetch';
export const soapFetch = getSoapFetch('test-environment');
export const useNotify: jest.Mock<ReturnType<typeof shell.useNotify>> = jest.fn(() => []);
export const useLocalStorage = jest.fn();
export const AppLink: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const editSettings = jest.fn(() => Promise.resolve({ data: {} }));
export const registerComponents: typeof shell.registerComponents = jest.fn();
export const registerActions: typeof shell.registerActions = jest.fn();
export const useRefresh: typeof shell.useRefresh = jest.fn();
export const addRoute: typeof shell.addRoute = jest.fn();
export const addSettingsView: typeof shell.addSettingsView = jest.fn();
export const addSearchView: typeof shell.addSearchView = jest.fn();
export const addBoardView: typeof shell.addBoardView = jest.fn();
export const getBoardById: typeof shell.getBoardById = jest.fn();
export const setCurrentBoard: typeof shell.setCurrentBoard = jest.fn();
export const reopenBoards: typeof shell.reopenBoards = jest.fn();
export const ACTION_TYPES: typeof shell.ACTION_TYPES = {
	NEW: 'new'
};

function parsePath(path: string): string {
	return `/${trimStart(path, '/')}`;
}
function usePushHistoryMock(): (params: shell.HistoryParams) => void {
	const history = useHistory();

	return useCallback(
		(location: string | shell.HistoryParams) => {
			if (typeof location === 'string') {
				history.push(parsePath(location));
			} else if (typeof location.path === 'string') {
				history.push(parsePath(location.path));
			} else {
				history.push(location.path);
			}
		},
		[history]
	);
}

function useReplaceHistoryMock(): (params: shell.HistoryParams) => void {
	const history = useHistory();

	return useCallback(
		(location: string | shell.HistoryParams) => {
			if (typeof location === 'string') {
				history.replace(parsePath(location));
			} else if (typeof location.path === 'string') {
				history.replace(parsePath(location.path));
			} else {
				history.replace(location.path);
			}
		},
		[history]
	);
}

export const usePushHistoryCallback = usePushHistoryMock;
export const useReplaceHistoryCallback = useReplaceHistoryMock;

/*
 * Integration mocks
 */

// Integrated components
const FakeIntegrationComponent = (): React.JSX.Element => <div data-testid="fake-component" />;
const IntegrationComponent = jest.fn(FakeIntegrationComponent);
const isIntegrationAvailable = false;
export const useIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);
export const getIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);

// Files links
// TODO set a generic empty mock here, and create a function to register on demand a mocked implementation that return
// 		the Files action
const getLink = undefined;
const getLinkAvailable = false;
export const useIntegratedFunction = jest.fn<
	[((...args: Array<unknown>) => unknown) | undefined, boolean],
	[string]
>((id) => [getLink, getLinkAvailable]);

// Files actions
// TODO set a generic empty mock here, and create a function to register on demand a mocked implementation that return
// 		the Files action
const getFilesAction = undefined;
const getFilesActionAvailable = false;
export const getAction = jest.fn<[Action | undefined, boolean], [string, string]>((type, id) => [
	getFilesAction,
	getFilesActionAvailable
]);

// Files upload
// TODO set a generic empty mock here, and create a function to register on demand a mocked implementation that return
// 		the Files action
const filesSelectDestinationFunction = undefined;
const filesSelectDestinationFunctionAvailable = false;
export const getIntegratedFunction = jest.fn<
	[((...args: Array<unknown>) => unknown) | undefined, boolean],
	[string]
>((id) => [filesSelectDestinationFunction, filesSelectDestinationFunctionAvailable]);
