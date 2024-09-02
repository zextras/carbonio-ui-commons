/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react';

import { Container, Text } from '@zextras/carbonio-design-system';
import { t } from '@zextras/carbonio-shell-ui';

import ModalFooter from './modal-footer';
import ModalHeader from './modal-header';

export const FolderInitializationErrorModal = ({
	onClose
}: {
	onClose: () => void;
}): React.JSX.Element => {
	const title = t('modal.initializeError.title', 'Oops!…Something went wrong');
	const body = t('modal.initializeError.content', 'Please refresh the page or try again later');
	const onConfirmLabel = t('modal.initializeError.buttonConfirm', 'Refresh');

	const onConfirm = useCallback(() => {
		window.location.reload();
	}, []);

	return (
		<>
			<ModalHeader onClose={onClose} title={title} />
			<Container padding={{ horizontal: 'large' }}>
				<Text>{body}</Text>
			</Container>
			<ModalFooter onConfirm={onConfirm} label={onConfirmLabel} disabled={false} />
		</>
	);
};
