/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act } from '@testing-library/react';
import { noop } from 'lodash';

import { setupTest, screen } from '../../../__test__/test-setup';
import { FolderInitializationErrorModal } from '../folder-initialization-error-modal';

beforeAll(() => {
	Object.defineProperty(window, 'location', {
		configurable: true,
		value: { reload: jest.fn() }
	});
});

describe('FolderInitializationErrorModal', () => {
	it('it correctly renders the component', () => {
		setupTest(<FolderInitializationErrorModal onClose={noop} />);
		expect(screen.getByText('modal.initializeError.title')).toBeInTheDocument();
		expect(screen.getByText('modal.initializeError.content')).toBeInTheDocument();
		expect(screen.getByText('modal.initializeError.buttonConfirm')).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', async () => {
		const onClose = jest.fn();
		const { user } = setupTest(<FolderInitializationErrorModal onClose={onClose} />);
		const closeButton = await screen.findByTestId('icon: CloseOutline');
		await act(async () => {
			await user.click(closeButton);
		});
		expect(onClose).toHaveBeenCalled();
	});

	it('refreshes the page when the confirm button is clicked', async () => {
		const { user } = setupTest(<FolderInitializationErrorModal onClose={noop} />);
		const refreshButton = screen.getByRole('button', {
			name: 'modal.initializeError.buttonConfirm'
		});
		await act(async () => {
			await user.click(refreshButton);
		});
		expect(window.location.reload).toHaveBeenCalled();
	});
});
