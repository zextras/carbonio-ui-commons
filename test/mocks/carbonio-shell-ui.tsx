/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { getMockedAccountItem } from './accounts/fakeAccounts';
import { roots } from './folders/roots';
import { getSoapFetch } from './network/fetch';
import { generateSettings } from './settings/settings-generator';

const FakeIntegration = (): JSX.Element => <div data-testid="fake-component" />;

export const FOLDERS = {
	USER_ROOT: '1',
	INBOX: '2',
	TRASH: '3',
	SPAM: '4',
	SENT: '5',
	DRAFTS: '6',
	CONTACTS: '7',
	TAGS: '8',
	CONVERSATIONS: '9',
	CALENDAR: '10',
	ROOT: '11',
	NOTEBOOK: '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS: '13',
	IM_LOGS: '14',
	TASKS: '15',
	BRIEFCASE: '16'
};

export const ZIMBRA_STANDARD_COLORS = [
	{ zValue: 0, hex: '#000000', zLabel: 'black' },
	{ zValue: 1, hex: '#2b73d2', zLabel: 'blue' },
	{ zValue: 2, hex: '#2196d3', zLabel: 'cyan' },
	{ zValue: 3, hex: '#639030', zLabel: 'green' },
	{ zValue: 4, hex: '#1a75a7', zLabel: 'purple' },
	{ zValue: 5, hex: '#d74942', zLabel: 'red' },
	{ zValue: 6, hex: '#ffc107', zLabel: 'yellow' },
	{ zValue: 7, hex: '#edaeab', zLabel: 'pink' },
	{ zValue: 8, hex: '#828282', zLabel: 'gray' },
	{ zValue: 9, hex: '#ba8b00', zLabel: 'orange' }
];

const mockedAccountItem = getMockedAccountItem();

const mockedAccountItems = [mockedAccountItem];

export const getUserAccount = jest.fn(() => mockedAccountItem);
export const useUserAccount = jest.fn(() => mockedAccountItem);
export const useUserAccounts = jest.fn(() => mockedAccountItems);
export const useAppContext = jest.fn(() => mockedAccountItems);
export const t = jest.fn((key: string) => key);
export const replaceHistory = jest.fn();
const getLink = {};
const getLinkAvailable = false;
export const useIntegratedFunction = jest.fn(() => [getLink, getLinkAvailable]);
export const useUserSettings = jest.fn(() => generateSettings());
export const getUserSettings = jest.fn();
const IntegrationComponent = jest.fn(FakeIntegration);
const isIntegrationAvailable = false;
export const useIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);
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
export const useRoot = jest.fn((id: string) => roots[id]);
export const useRoots = jest.fn(() => roots);
export const useFolders = jest.fn();
export const addBoard = jest.fn();
export const useBoardHooks = jest.fn();
export const minimizeBoards = jest.fn();
export const getCurrentRoute = jest.fn();
export const getTags = jest.fn();
export * from './network/fetch';
export const soapFetch = getSoapFetch('test-environment');
export const useTags = jest.fn();
