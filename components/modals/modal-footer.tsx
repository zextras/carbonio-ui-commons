/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */

import React, { FC, ReactElement, useMemo } from 'react';

import {
	Container,
	Button,
	Padding,
	Divider,
	Tooltip,
	AnyColor
} from '@zextras/carbonio-design-system';
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

	const secondaryTypeAndColor = useMemo<
		| { type: 'ghost'; color: AnyColor }
		| {
				type: 'default' | 'outlined';
				backgroundColor: AnyColor | undefined;
				labelColor: AnyColor;
		  }
	>(() => {
		if (secondaryBtnType === 'ghost') {
			return { type: secondaryBtnType, color: secondaryColor };
		}
		return {
			type: secondaryBtnType,
			backgroundColor: secondarybackground,
			labelColor: secondaryColor
		};
	}, [secondaryBtnType, secondaryColor, secondarybackground]);

	const primaryTypeAndColor = useMemo<
		| { type: 'ghost'; color: AnyColor }
		| {
				type: 'default' | 'outlined';
				backgroundColor: AnyColor;
				labelColor: AnyColor;
		  }
	>(() => {
		if (primaryBtnType === 'ghost') {
			return { type: primaryBtnType, color };
		}
		return { type: primaryBtnType, backgroundColor: color || background, labelColor: color };
	}, [background, color, primaryBtnType]);

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
										{...secondaryTypeAndColor}
										onClick={secondaryAction}
										label={secondaryLabel ?? cancelLabel}
										disabled={secondaryDisabled}
										size={size}
									/>
								</Tooltip>
							) : (
								<Button
									{...secondaryTypeAndColor}
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
									onClick={onConfirm}
									label={label}
									disabled={disabled}
									icon={primaryButtonIcon}
									iconPlacement="left"
									{...primaryTypeAndColor}
								/>
							</Tooltip>
						) : (
							<Button
								size={size}
								onClick={onConfirm}
								label={label}
								disabled={disabled}
								icon={primaryButtonIcon}
								iconPlacement="left"
								{...primaryTypeAndColor}
							/>
						)}
					</Padding>
				</Container>
			</Container>
		</Container>
	);
};
export default ModalFooter;
