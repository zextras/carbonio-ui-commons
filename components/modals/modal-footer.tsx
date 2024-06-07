/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */

import React, { FC, ReactElement, useMemo } from 'react';

import { Container, Button, Padding, Divider, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import type { ModalFooterProps } from '../../types';

const ModalFooter: FC<ModalFooterProps> = ({
	mainAlignment = 'center',
	crossAlignment = 'center',
	onConfirm,
	label,
	secondaryAction,
	secondaryLabel,
	primaryBtnType = 'default',
	secondaryBtnType = 'default',
	disabled,
	secondaryDisabled,
	background = 'primary',
	secondarybackground,
	color = 'primary',
	secondaryColor = 'secondary',
	size = 'medium',
	showDivider = true,
	tooltip,
	secondaryTooltip,
	paddingTop = 'medium',
	additionalAction,
	additionalBtnType = 'outlined',
	additionalColor = 'secondary',
	additionalLabel,
	primaryButtonIcon
}): ReactElement => {
	const [t] = useTranslation();

	const cancelLabel = useMemo(() => t('label.cancel', 'cancel'), [t]);

	return (
		<Container
			mainAlignment={mainAlignment}
			crossAlignment={crossAlignment}
			padding={{
				top: paddingTop
			}}
		>
			{showDivider && (
				<Container
					padding={{ top: 'small', bottom: 'small' }}
					mainAlignment="center"
					crossAlignment="flex-start"
					orientation="horizontal"
					height="fit"
				>
					<Divider />
				</Container>
			)}
			<Container orientation="horizontal" mainAlignment="space-between">
				{additionalAction && (
					<Container orientation="horizontal" width="fit">
						<Button
							color={additionalColor}
							type={additionalBtnType}
							onClick={additionalAction}
							label={additionalLabel ?? cancelLabel}
							size={size}
						/>
						<Padding horizontal="extrasmall" />
					</Container>
				)}
				<Container
					padding={{ top: 'small', bottom: 'small' }}
					mainAlignment="flex-end"
					crossAlignment="flex-start"
					orientation="horizontal"
					height="fit"
				>
					{secondaryAction && (
						<Padding right="small" vertical="small">
							{secondaryTooltip ? (
								<Tooltip label={secondaryTooltip} placement="top" maxWidth="fit">
									<Button
										backgroundColor={secondarybackground}
										color={secondaryColor}
										type={secondaryBtnType}
										onClick={secondaryAction}
										label={secondaryLabel ?? cancelLabel}
										disabled={secondaryDisabled}
										size={size}
									/>
								</Tooltip>
							) : (
								<Button
									backgroundColor={secondarybackground}
									color={secondaryColor}
									type={secondaryBtnType}
									onClick={secondaryAction}
									label={secondaryLabel ?? cancelLabel}
									disabled={secondaryDisabled}
									size={size}
								/>
							)}
						</Padding>
					)}

					<Padding vertical="small">
						{tooltip ? (
							<Tooltip label={tooltip} placement="top" maxWidth="fit">
								<Button
									size={size}
									color={color}
									onClick={onConfirm}
									label={label}
									type={primaryBtnType}
									disabled={disabled}
									backgroundColor={color || background}
									icon={primaryButtonIcon}
									iconPlacement="left"
								/>
							</Tooltip>
						) : (
							<Button
								size={size}
								color={color}
								onClick={onConfirm}
								label={label}
								type={primaryBtnType}
								disabled={disabled}
								backgroundColor={color || background}
								icon={primaryButtonIcon}
								iconPlacement="left"
							/>
						)}
					</Padding>
				</Container>
			</Container>
		</Container>
	);
};
export default ModalFooter;
