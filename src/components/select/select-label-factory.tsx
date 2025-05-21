/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement } from 'react';

import { Container, Icon, Padding, Row, Text, getColor } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import { CustomLabelFactoryProps } from '../../types/select';

export const Square = styled.div<{ $disabled?: boolean; $color: string | undefined }>`
	width: 1rem;
	height: 1rem;
	background: ${({ $color }): string | undefined => $color};
	border-radius: 0.25rem;
	opacity: ${({ $disabled }): number => ($disabled ? 0.5 : 1)};
`;

export const ColorContainer = styled(Container)`
	border-bottom: 0.0625rem solid ${({ theme }): string => theme.palette.gray2.regular};
	transition: background 0.2s ease-out;
	&:hover {
		background: ${({ theme, background }): string => getColor(`${background}.hover`, theme)};
	}
`;

export const TextUpperCase = styled(Text)`
	text-transform: capitalize;
	color: ${({ theme, disabled }): string =>
		disabled ? theme.palette.text.disabled : theme.palette.text.regular};
`;

export const FolderSelectorLabelFactory = ({
	selected,
	label,
	open,
	focus,
	disabled
}: CustomLabelFactoryProps): ReactElement => (
	<ColorContainer
		orientation="horizontal"
		width="fill"
		crossAlignment="center"
		mainAlignment="space-between"
		borderRadius="half"
		padding={{
			all: 'small'
		}}
		background="gray5"
		style={{ cursor: disabled ? 'no-drop' : 'pointer' }}
	>
		<Row width="100%" takeAvailableSpace mainAlignment="space-between">
			<Row
				orientation="vertical"
				crossAlignment="flex-start"
				mainAlignment="flex-start"
				padding={{ left: 'small' }}
			>
				<Text
					size="small"
					disabled={disabled}
					color={(disabled && 'text.disabled') || ((open || focus) && 'primary') || 'secondary'}
				>
					{label}
				</Text>
				<Row>
					<Padding right="small">
						<Square $color={selected[0].color} $disabled={disabled} />
					</Padding>
					<TextUpperCase disabled={disabled}>{selected[0].label}</TextUpperCase>
				</Row>
			</Row>
		</Row>
		<Icon
			size="large"
			icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
			disabled={disabled}
			color={(disabled && 'text.disabled') || ((open || focus) && 'primary') || 'secondary'}
			style={{ alignSelf: 'center' }}
		/>
	</ColorContainer>
);
