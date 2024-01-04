/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, ReactNode } from 'react';

import shell from '@zextras/carbonio-shell-ui';

import { generateAccount } from './accounts/account-generator';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';
import { tags } from './tags/tags';

export { FOLDERS, ZIMBRA_STANDARD_COLORS } from './carbonio-shell-ui-constants';

const FakeIntegration = (): React.JSX.Element => <div data-testid="fake-component" />;

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
const getLink = {};
const getLinkAvailable = false;
export const useIntegratedFunction = jest.fn(() => [getLink, getLinkAvailable]);

const IntegrationComponent = jest.fn(FakeIntegration);
const isIntegrationAvailable = false;
export const useIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);
export const getIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);
const getFilesAction = {};
const getFilesActionAvailable = false;
export const getAction = jest.fn(() => [getFilesAction, getFilesActionAvailable]);
const filesSelectDestinationFunction = jest.fn();
const filesSelectDestinationFunctionAvailable = false;
export const getIntegratedFunction = jest.fn(() => [
	filesSelectDestinationFunction,
	filesSelectDestinationFunctionAvailable
]);
export const useBoard = jest.fn();

export const useAppContext = jest.fn(() => mockedAccounts);
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
export const ACTION_TYPES: typeof shell.ACTION_TYPES = {
	NEW: 'new'
};
