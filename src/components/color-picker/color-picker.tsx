/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import {
	Button,
	Container,
	Icon,
	Input,
	Popover,
	Text,
	Tooltip,
	useSnackbar
} from '@zextras/carbonio-design-system';
import { noop } from 'lodash';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';

import { ColorDot, ColorDotOption, ColorDotsRow, findExactColorIndex } from './color-dots-row';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useOnOutsideClick } from '../../hooks/use-on-outside-click';
import { usePreventBackdropClose } from '../../hooks/use-prevent-backdrop-close';
import { copyToClipboard } from '../../utils/clipboard';

const CustomColorTriggerButton = styled.button`
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	padding: 0;

	&:disabled {
		cursor: default;
		opacity: 0.5;
	}
`;

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export type ColorPickerProps = {
	/** Standard palette shown as dots, with labels already translated. */
	colors: ColorDotOption[];
	/** Current color, as hex. */
	value: string;
	onChange: (hex: string) => void;
	/** Notified whenever the custom-color popover opens/closes, e.g. to disable sibling controls. */
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	/** Hint text shown below the row. */
	caption?: string;
};

/**
 * A row of standard color dots plus a "+" trigger opening a custom color picker (hue/saturation
 * and exact hex input). A custom color is only applied once confirmed with "Choose"; Close,
 * Escape, an outside click or the "+" trigger again dismiss it without changes.
 */
export const ColorPicker: FC<ColorPickerProps> = ({
	colors,
	value,
	onChange,
	onOpenChange,
	disabled = false,
	caption
}) => {
	const [t] = useTranslation();
	const createSnackbar = useSnackbar();

	const isCustomColorSelected = findExactColorIndex(colors, value) === undefined;

	// Persists across re-selecting a standard color, so a previously-picked custom color keeps
	// showing its own (deselected) dot instead of disappearing — the user can click it to go back
	// to it. It only tracks the *current mount*'s custom pick, resetting naturally on remount
	// (i.e. next time the modal opens), which mirrors the original per-session behavior.
	const [lastCustomHex, setLastCustomHex] = useState<string | undefined>(
		isCustomColorSelected ? value : undefined
	);

	const colorSwatchRef = useRef<HTMLButtonElement>(null);
	const popoverContentRef = useRef<HTMLDivElement>(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [draftHex, setDraftHex] = useState(value);
	const [hexInputValue, setHexInputValue] = useState(value);

	usePreventBackdropClose(isPopoverOpen, popoverContentRef);

	useEffect(() => {
		onOpenChange?.(isPopoverOpen);
	}, [isPopoverOpen, onOpenChange]);

	useEffect(() => {
		if (isCustomColorSelected) {
			setLastCustomHex(value);
		}
	}, [isCustomColorSelected, value]);

	useEffect(() => {
		if (isPopoverOpen) {
			setDraftHex(value);
			setHexInputValue(value);
		}
	}, [isPopoverOpen, value]);

	const onDraftColorChange = useCallback((hex: string) => {
		setDraftHex(hex);
		setHexInputValue(hex);
	}, []);

	const onHexInputChange = useCallback((inputValue: string) => {
		setHexInputValue(inputValue);
		if (HEX_COLOR_REGEX.test(inputValue)) {
			setDraftHex(inputValue);
		}
	}, []);

	const onCopyHexColor = useCallback((): void => {
		copyToClipboard(hexInputValue)
			.then(() => {
				createSnackbar({
					key: 'color-picker-hex-copied',
					replace: true,
					severity: 'success',
					hideButton: true,
					label: t('snackbar.hex_color_copied', 'Hex color copied'),
					autoHideTimeout: 3000
				});
			})
			.catch(() => {
				createSnackbar({
					key: 'color-picker-hex-copy-error',
					replace: true,
					severity: 'error',
					hideButton: true,
					label: t('label.error_try_again', 'Something went wrong, please try again'),
					autoHideTimeout: 3000
				});
			});
	}, [hexInputValue, createSnackbar, t]);

	const CopyHexColorIcon = useCallback(
		(): ReactElement => (
			<Tooltip label={t('tooltip.copy_hex_color', 'Copy hex color')} placement="top">
				<CustomColorTriggerButton type="button" onClick={onCopyHexColor}>
					<Icon icon="Copy" size="large" color="primary" />
				</CustomColorTriggerButton>
			</Tooltip>
		),
		[t, onCopyHexColor]
	);

	const onSaveCustomColor = useCallback(() => {
		onChange(draftHex);
		setIsPopoverOpen(false);
	}, [draftHex, onChange]);

	const onCancelCustomColor = useCallback(() => {
		setIsPopoverOpen(false);
	}, []);

	useCloseOnEscape(isPopoverOpen, onCancelCustomColor);
	useOnOutsideClick(isPopoverOpen, popoverContentRef, colorSwatchRef, onCancelCustomColor);

	const onToggleTrigger = useCallback(() => {
		setIsPopoverOpen((prev) => !prev);
	}, []);

	const onSelectExistingCustomColor = useCallback(() => {
		if (lastCustomHex) {
			onChange(lastCustomHex);
		}
	}, [lastCustomHex, onChange]);

	return (
		<Container
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			orientation="vertical"
			height="fit"
			gap="0.5rem"
		>
			<ColorDotsRow
				colors={colors}
				value={value}
				onChange={onChange}
				disabled={disabled || isPopoverOpen}
			>
				{lastCustomHex && (
					<Tooltip
						label={t('label.custom_color', 'Custom color ({{hex}})', { hex: lastCustomHex })}
					>
						<ColorDot
							type="button"
							aria-label={t('label.custom_color', 'Custom color ({{hex}})', {
								hex: lastCustomHex
							})}
							aria-pressed={isCustomColorSelected}
							$color={lastCustomHex}
							$selected={isCustomColorSelected}
							onClick={onSelectExistingCustomColor}
							disabled={disabled || isPopoverOpen}
						/>
					</Tooltip>
				)}
				<Tooltip label={t('label.customize_color', 'Customize color')} triggerRef={colorSwatchRef}>
					<CustomColorTriggerButton type="button" onClick={onToggleTrigger} disabled={disabled}>
						<Icon icon="PlusCircleOutline" size="large" color="primary" />
					</CustomColorTriggerButton>
				</Tooltip>
				<Popover
					disablePortal
					anchorEl={colorSwatchRef}
					open={isPopoverOpen}
					// Popover's own click-outside/Escape handling is a plain bubble-phase document
					// listener with no notion of "the gesture started inside" — closing is fully owned
					// by useCloseOnEscape/useOnOutsideClick above instead, which get that right.
					onClose={noop}
					placement="bottom-start"
					style={{ zIndex: 1001 }}
				>
					<Container
						ref={popoverContentRef}
						padding="0.75rem"
						gap="0.75rem"
						width="fit"
						height="fit"
					>
						<HexColorPicker color={draftHex} onChange={onDraftColorChange} />
						<Input
							label={t('label.hex_color', 'Hex color')}
							value={hexInputValue}
							onChange={(e): void => onHexInputChange(e.target.value)}
							CustomIcon={CopyHexColorIcon}
						/>
						<Container
							orientation="horizontal"
							mainAlignment="flex-end"
							crossAlignment="flex-end"
							height="fit"
							width="fill"
							gap="0.5rem"
						>
							<Button
								type="outlined"
								color="secondary"
								label={t('label.close', 'Close')}
								onClick={onCancelCustomColor}
							/>
							<Button
								color="primary"
								label={t('label.choose', 'Choose')}
								onClick={onSaveCustomColor}
							/>
						</Container>
					</Container>
				</Popover>
			</ColorDotsRow>
			{caption && (
				<Text size="small" color="secondary">
					{caption}
				</Text>
			)}
		</Container>
	);
};
