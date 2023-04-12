/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { generateAccount } from './accounts/account-generator';
import { generateRoots } from './folders/roots-generator';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';
import { generateFolders } from './folders/folders-generator';

export { FOLDERS, ZIMBRA_STANDARD_COLORS } from './carbonio-shell-ui-constants';

const FakeIntegration = (): JSX.Element => <div data-testid="fake-component" />;

const mockedAccount = generateAccount();
const mockedAccounts = [mockedAccount];
const mockedSettings = generateSettings();
const mockedRoots = generateRoots();
const mockedFolders = generateFolders();

export const getUserAccount = jest.fn(() => mockedAccount);
export const useUserAccount = jest.fn(() => mockedAccount);
export const useUserAccounts = jest.fn(() => mockedAccounts);
export const useUserSettings = jest.fn(() => mockedSettings);
export const getUserSettings = jest.fn(() => mockedSettings);
export const useAppContext = jest.fn(() => mockedAccounts);
export const t = jest.fn((key: string) => key);
export const replaceHistory = jest.fn();
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
export const getBridgedFunctions = jest.fn();
export const useRoot = jest.fn((id: string) => mockedRoots[id]);
export const getRoot = jest.fn((id: string) => mockedRoots[id]);
export const useRoots = jest.fn(() => mockedRoots);
export const getRoots = jest.fn(() => mockedRoots);
export const useFolder = jest.fn((id: string) => mockedFolders[id]);
export const getFolder = jest.fn((id: string) => mockedFolders[id]);
export const useFolders = jest.fn(() => mockedFolders);
export const getFolders = jest.fn(() => mockedFolders);
export const addBoard = jest.fn();
export const useBoardHooks = jest.fn();
export const minimizeBoards = jest.fn();
export const getCurrentRoute = jest.fn();
export const getTags = jest.fn();
export * from './network/fetch';
export const soapFetch = getSoapFetch('test-environment');
export const useTags = jest.fn();
