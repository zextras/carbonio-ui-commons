/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { noop } from 'lodash';
import React from 'react';
import { getSoapFetch } from './network/fetch';

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

const getNewName = (): { firstName: string; lastName: string } => ({
	firstName: faker?.name?.firstName?.() ?? '',
	lastName: faker?.name?.lastName?.() ?? ''
});

const getMockedAccountItem = (): any => {
	const identity1 = getNewName();
	return {
		identities: {
			identity: [
				{
					id: '1',
					name: 'DEFAULT',
					_attrs: {
						zimbraPrefFromAddressType: faker?.internet?.email?.() ?? '',
						zimbraPrefIdentityName: 'DEFAULT'
					}
				},
				{
					id: '2',
					name: `${identity1.firstName} ${identity1.lastName}`,
					_attrs: {
						zimbraPrefFromAddressType:
							faker?.internet?.email?.(identity1.firstName, identity1.lastName) ?? '',
						zimbraPrefIdentityName: `${identity1.firstName} ${identity1.lastName}`
					}
				}
			]
		}
	};
};

export const getUserAccount = jest.fn(getMockedAccountItem);
export const useUserAccount = jest.fn(getMockedAccountItem);
export const t = jest.fn(noop);
export const replaceHistory = jest.fn();
const getLink = jest.fn(() => noop);
const getLinkAvailable = jest.fn(() => noop);
export const useIntegratedFunction = jest.fn(() => [getLink, getLinkAvailable]);
export const useUserSettings = jest.fn(() => ({
	prefs: {
		zimbraPrefUseTimeZoneListInCalendar: 'TRUE'
	}
}));
export const getUserSettings = jest.fn();
const IntegrationComponent = jest.fn(FakeIntegration);
const isIntegrationAvailable = jest.fn(() => true);

export const useIntegratedComponent = jest.fn(() => [IntegrationComponent, isIntegrationAvailable]);
const getFilesAction = jest.fn(() => noop);
const getFilesActionAvailable = jest.fn(() => noop);
export const getAction = jest.fn(() => [getFilesAction, getFilesActionAvailable]);
export const useBoard = jest.fn();
export const getBridgedFunctions = jest.fn();
export * from './network/fetch';

export const soapFetch = getSoapFetch('test-environment');
