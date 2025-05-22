/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';

import type { SelectProps, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { Container, Icon, Padding, Row, Select, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ZIMBRA_STANDARD_COLORS } from '../../constants/utils';
import { CustomLabelFactoryProps } from '../../types/select';

const Square = styled.div<{ $color: string }>`
	width: 1.125rem;
	height: 1.125rem;
	position: relative;
	top: -0.1875rem;
	border: 0.0625rem solid ${({ theme }): string => theme.palette.gray2.regular};
	background: ${({ $color }): string | undefined => $color};
	border-radius: 0.25rem;
`;

export const ColorContainer = styled(Container)`
	border-bottom: 0.0625rem solid ${({ theme }): string => theme.palette.gray2.regular};
	cursor: 'pointer';
`;

export const TextUpperCase = styled(Text)`
	text-transform: capitalize;
`;

const LabelFactory = ({
	selected,
	label,
	open,
	focus
}: CustomLabelFactoryProps): React.JSX.Element => (
	<ColorContainer
		orientation="horizontal"
		width="fill"
		crossAlignment="center"
		mainAlignment="space-between"
		borderRadius="half"
		background="gray5"
		padding={{
			all: 'small'
		}}
	>
		<Row width="100%" takeAvailableSpace mainAlignment="space-between">
			<Row
				orientation="vertical"
				crossAlignment="flex-start"
				mainAlignment="flex-start"
				padding={{ left: 'small' }}
			>
				<Text size="small" color={open || focus ? 'primary' : 'secondary'}>
					{label}
				</Text>
				<TextUpperCase>{selected[0].label}</TextUpperCase>
			</Row>
			<Padding right="small">
				<Square $color={ZIMBRA_STANDARD_COLORS[parseInt(selected[0].value, 10)].hex} />
			</Padding>
		</Row>
		<Icon
			size="large"
			icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
			color={open || focus ? 'primary' : 'secondary'}
			style={{ alignSelf: 'center' }}
		/>
	</ColorContainer>
);

export type ColorSelectProps = {
	onChange: SingleSelectionOnChange;
	defaultColor: number;
	label: string;
};

export const ColorSelect = ({
	onChange,
	defaultColor = 0,
	label
}: ColorSelectProps): React.JSX.Element => {
	const [t] = useTranslation();
	const colors = useMemo<SelectProps['items']>(
		() =>
			ZIMBRA_STANDARD_COLORS.map((el, index) => {
				const colorLabel = t(`colors.${el.zLabel}`, el.zLabel);
				return {
					label: colorLabel,
					value: index.toString(),
					customComponent: (
						<Container
							width="100%"
							mainAlignment="space-between"
							orientation="horizontal"
							height="fit"
						>
							<Padding left="small">
								<TextUpperCase>{colorLabel}</TextUpperCase>
							</Padding>
							<Square $color={el.hex} />
						</Container>
					)
				};
			}),
		[t]
	);
	const defaultSelection = useMemo(() => colors[defaultColor], [colors, defaultColor]);

	return (
		<Select
			label={label}
			onChange={onChange}
			items={colors}
			defaultSelection={defaultSelection}
			LabelFactory={LabelFactory}
			data-testid="color-select"
		/>
	);
};
