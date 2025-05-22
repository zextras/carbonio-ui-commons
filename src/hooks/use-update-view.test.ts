/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { fireEvent } from '@testing-library/react';

import { useUpdateView } from './use-update-view';
import { createSoapAPIInterceptor } from '../test/mocks/network/msw/create-api-interceptor';
import { setupHook } from '../test/test-setup';

describe('useUpdateView', () => {
	it('should register a listener to the "updateView" event', () => {
		const addEventListener = jest.spyOn(window, 'addEventListener');
		setupHook(useUpdateView);
		expect(addEventListener).toHaveBeenCalledWith<Parameters<typeof window.addEventListener>>(
			'updateView',
			expect.anything()
		);
	});

	it('should call the NoOp when the "updateView" event is triggered', async () => {
		const callWatcher = jest.fn();
		const apiInterceptor = createSoapAPIInterceptor('NoOp').then(() => callWatcher());
		setupHook(useUpdateView);
		fireEvent(window, new CustomEvent('updateView'));
		await apiInterceptor;
		expect(callWatcher).toHaveBeenCalled();
	});

	it('should unregister a listener to the "updateView" event', () => {
		const removeEventListener = jest.spyOn(window, 'removeEventListener');
		const { unmount } = setupHook(useUpdateView);
		unmount();
		expect(removeEventListener).toHaveBeenCalledWith<Parameters<typeof window.removeEventListener>>(
			'updateView',
			expect.anything()
		);
	});
});
