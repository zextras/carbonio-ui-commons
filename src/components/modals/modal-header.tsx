/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';

import {
	Divider,
	Text,
	Row,
	IconButton,
	Padding,
	Container
} from '@zextras/carbonio-design-system';

export const ModalHeader: FC<{ title: string; onClose?: () => void; showCloseIcon?: boolean }> = ({
	title,
	onClose,
	showCloseIcon = true
}) => (
	<Container mainAlignment="space-between" width="100%">
		<Row takeAvailableSpace mainAlignment="space-between" width="100%">
			<Row width="calc(100% - 1.5rem)" takeAvailableSpace mainAlignment="flex-start">
				<Text weight="bold" size="large">
					{title}
				</Text>
			</Row>
			{onClose && showCloseIcon && (
				<Row mainAlignment="flex-start">
					<IconButton
						size="medium"
						style={{ padding: 0, margin: 0 }}
						onClick={onClose}
						icon="CloseOutline"
					/>
				</Row>
			)}
		</Row>
		<Padding top="medium" />
		<Divider />
		<Padding bottom="medium" />
	</Container>
);
