/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoapLink, SoapFolder, Tag, Tags } from '@zextras/carbonio-shell-ui';
import React, { FC, ReactNode } from 'react';
import { generateAccount } from './accounts/account-generator';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';
import { tags } from './tags/tags';

export { FOLDERS, ZIMBRA_STANDARD_COLORS } from './carbonio-shell-ui-constants';

export type MockSoapNotify = {
	seq: number;
	created?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<SoapFolder>;
		link?: Array<SoapLink>;
		tag?: Array<Tag>;
	};
	modified?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<Partial<SoapFolder>>;
		link?: Array<Partial<SoapLink>>;
		tag?: Array<Partial<Tag>>;
		mbx: [{ s: number }];
	};
	deleted?: string;
};

const FakeIntegration = (): JSX.Element => <div data-testid="fake-component" />;

const mockedAccount = generateAccount();
const mockedAccounts = [mockedAccount];
const mockedSettings = generateSettings();
const mockedTags: Tags = tags;

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
export const useNotify = jest.fn(() => [] as MockSoapNotify[]);
export const useLocalStorage = jest.fn();
export const AppLink: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
