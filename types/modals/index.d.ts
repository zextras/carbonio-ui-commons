/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonProps, ContainerProps, IconComponent } from '@zextras/carbonio-design-system';

export type ModalFooterProps = {
	mainAlignment?: ContainerProps['mainAlignment'] | undefined;
	crossAlignment?: ContainerProps['crossAlignment'] | undefined;
	padding?: Record<string, string> | undefined;
	onConfirm: (e?: SyntheticEvent<Element, Event> | KeyboardEvent) => void;
	secondaryAction?: (e?: SyntheticEvent<Element, Event> | KeyboardEvent) => void | undefined;
	label: string;
	secondaryLabel?: string | undefined;
	disabled?: boolean | undefined;
	secondaryDisabled?: boolean | undefined;
	background?: ContainerProps['background'] | undefined;
	secondarybackground?: ContainerProps['background'] | undefined;
	color?: string | undefined;
	secondaryColor?: string | undefined;
	size?: ButtonProps['size'] | undefined;
	primaryBtnType?: ButtonProps['type'] | undefined;
	secondaryBtnType?: ButtonProps['type'] | undefined;
	showDivider?: boolean;
	tooltip?: string;
	secondaryTooltip?: string;
	paddingTop?: string;
	additionalAction?: () => void;
	additionalBtnType?: ButtonProps['type'];
	additionalColor?: string;
	additionalLabel?: string;
	primaryButtonIcon?: IconComponent;
};
