/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, ReactNode, useCallback } from 'react';

import shell, { HistoryParams } from '@zextras/carbonio-shell-ui';
import { trimStart } from 'lodash';
import { useHistory } from 'react-router-dom';

import { generateAccount } from './accounts/account-generator';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';
import { tags } from './tags/tags';

export { FOLDERS, ZIMBRA_STANDARD_COLORS, JSNS, ROOT_NAME } from './carbonio-shell-ui-constants';

export const mockedAccount = generateAccount();
const mockedAccounts = [mockedAccount];
const mockedSettings = generateSettings();
const mockedTags: shell.Tags = tags;

export const getUserAccount: jest.Mock<ReturnType<typeof shell.getUserAccount>> = jest.fn(
	() => mockedAccount
);
export const useUserAccount: jest.Mock<ReturnType<typeof shell.useUserAccount>> = jest.fn(
	() => mockedAccount
);
export const useUserAccounts: jest.Mock<ReturnType<typeof shell.useUserAccounts>> = jest.fn(
	() => mockedAccounts
);

export const useUserSettings = jest.fn(() => mockedSettings);
export const getUserSettings = jest.fn(() => mockedSettings);
export const t = jest.fn((key: string) => key);
export const replaceHistory = jest.fn();
export const pushHistory = jest.fn();

export const useBoard = jest.fn();

export const useAppContext = jest.fn<unknown, []>(() => mockedAccounts);
export const setAppContext = jest.fn();
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
export const removeRoute: typeof shell.removeRoute = jest.fn();
export const addSettingsView: typeof shell.addSettingsView = jest.fn();
export const addSearchView: typeof shell.addSearchView = jest.fn();
export const addBoardView: typeof shell.addBoardView = jest.fn();
export const getBoardById: typeof shell.getBoardById = jest.fn();
export const setCurrentBoard: typeof shell.setCurrentBoard = jest.fn();
export const reopenBoards: typeof shell.reopenBoards = jest.fn();
export const registerFunctions: typeof shell.registerFunctions = jest.fn();
export const ACTION_TYPES: typeof shell.ACTION_TYPES = {
	CONVERSATION: 'conversation',
	CONVERSATION_lIST: 'conversation_list',
	MESSAGE: 'message',
	MESSAGE_lIST: 'message_list',
	CONTACT: 'contact',
	CONTACT_lIST: 'contact_list',
	INVITE: 'invite',
	INVITE_lIST: 'invite_list',
	APPOINTMENT: 'appointment',
	APPOINTMENT_lIST: 'appointment_list',
	FOLDER: 'folder',
	FOLDER_lIST: 'folder_list',
	CALENDAR: 'calendar',
	CALENDAR_lIST: 'calendar_list',
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

// Integrated actions
export const getAction = jest.fn<
	ReturnType<typeof shell.getAction>,
	Parameters<typeof shell.getAction>
>((type, id) => [undefined, false]);

// Integrated functions
export const getIntegratedFunction = jest.fn<
	ReturnType<typeof shell.getIntegratedFunction>,
	Parameters<typeof shell.getIntegratedFunction>
>((id) => [jest.fn(), false]);

export const useIntegratedFunction = jest.fn<
	ReturnType<typeof shell.useIntegratedFunction>,
	Parameters<typeof shell.useIntegratedFunction>
>((id) => [jest.fn(), false]);
