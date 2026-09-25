/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useState } from 'react';

import { fireEvent } from '@testing-library/react';
import { CustomModal } from '@zextras/carbonio-design-system';

import { screen, setupTest } from '../../../__test__/test-setup';
import { ColorDotOption } from '../color-dots-row';
import { ColorPicker, ColorPickerProps } from '../color-picker';

const COLORS: ColorDotOption[] = [
	{ hex: '#000000', label: 'black' },
	{ hex: '#2b73d2', label: 'blue' },
	{ hex: '#29B6F6', label: 'cyan' },
	{ hex: '#66BB6A', label: 'green' }
];
const STANDARD_COLOR = COLORS[1];
const ANOTHER_STANDARD_COLOR = COLORS[3];
const CUSTOM_HEX = '#123456';
const CUSTOM_COLOR_LABEL = `Custom color (${CUSTOM_HEX})`;
const HEX_INPUT_LABEL = 'Hex color';
const ARIA_PRESSED = 'aria-pressed';

const getStandardDot = (label: string): HTMLElement => screen.getByRole('button', { name: label });

const getCustomizeTrigger = (): HTMLElement =>
	screen.getByRoleWithIcon('button', { icon: 'icon: PlusCircleOutline' });

const getHexInput = (): HTMLElement => screen.getByRole('textbox', { name: HEX_INPUT_LABEL });

const getCopyHexButton = (): HTMLElement =>
	screen.getByRoleWithIcon('button', { icon: 'icon: Copy' });

describe('ColorPicker', () => {
	test('renders the standard color dots and calls onChange with the clicked hex', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		const dot = getStandardDot(ANOTHER_STANDARD_COLOR.label);
		expect(dot).toHaveAttribute(ARIA_PRESSED, 'false');

		await user.click(dot);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(ANOTHER_STANDARD_COLOR.hex);
	});

	test('marks the dot matching the current value as selected', () => {
		setupTest(<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} />);

		expect(getStandardDot(STANDARD_COLOR.label)).toHaveAttribute(ARIA_PRESSED, 'true');
	});

	test('does not render a custom-color dot when the current value is a standard color', () => {
		setupTest(<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} />);

		expect(screen.queryByRole('button', { name: CUSTOM_COLOR_LABEL })).not.toBeInTheDocument();
	});

	test('shows a selected custom-color dot when the current value is not a standard color', () => {
		setupTest(<ColorPicker colors={COLORS} value={CUSTOM_HEX} onChange={vi.fn()} />);

		const customDot = screen.getByRole('button', { name: CUSTOM_COLOR_LABEL });
		expect(customDot).toBeVisible();
		expect(customDot).toHaveAttribute(ARIA_PRESSED, 'true');
	});

	test('resets the hex input to the current value each time the popover reopens', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());
		expect(getHexInput()).toHaveValue(STANDARD_COLOR.hex);

		await user.clear(getHexInput());
		await user.type(getHexInput(), '#abcdef');
		expect(getHexInput()).toHaveValue('#abcdef');

		await user.click(screen.getByText('Close'));
		expect(onChange).not.toHaveBeenCalled();

		await user.click(getCustomizeTrigger());
		expect(getHexInput()).toHaveValue(STANDARD_COLOR.hex);
	});

	test('typing a valid hex updates the draft, an invalid one is ignored on save', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());

		await user.clear(getHexInput());
		await user.type(getHexInput(), '#ff0000');
		expect(getHexInput()).toHaveValue('#ff0000');

		await user.clear(getHexInput());
		await user.type(getHexInput(), 'zzz');
		// The input still reflects whatever was typed, even though it's not a valid hex.
		expect(getHexInput()).toHaveValue('zzz');

		await user.click(screen.getByText('Choose'));

		// The invalid text never became the draft color, so the last valid one is saved instead.
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#ff0000');
	});

	test('copying the hex color writes it to the clipboard and shows a success snackbar', async () => {
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} />
		);

		await user.click(getCustomizeTrigger());
		const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue();

		await user.click(getCopyHexButton());

		expect(writeText).toHaveBeenCalledWith(STANDARD_COLOR.hex);
		expect(await screen.findByText('Hex color copied')).toBeVisible();
	});

	test('shows an error snackbar when copying the hex color fails', async () => {
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} />
		);

		await user.click(getCustomizeTrigger());
		vi.spyOn(window.navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));

		await user.click(getCopyHexButton());

		expect(await screen.findByText('Something went wrong, please try again')).toBeVisible();
	});

	test('saving closes the popover and calls onChange with the draft color', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());
		await user.clear(getHexInput());
		await user.type(getHexInput(), '#abcdef');

		await user.click(screen.getByText('Choose'));

		expect(onChange).toHaveBeenCalledWith('#abcdef');
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
	});

	test('cancelling closes the popover without calling onChange', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());
		await user.click(screen.getByText('Close'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
	});

	test('clicking outside the popover closes it without calling onChange', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<>
				<div>outside content</div>
				<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
			</>
		);

		await user.click(getCustomizeTrigger());
		await user.click(screen.getByText('outside content'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
	});

	test('clicking outside the popover closes it even inside a CustomModal, without closing the modal', async () => {
		const onChange = vi.fn();
		const onModalClose = vi.fn();
		const { user } = setupTest(
			<CustomModal open onClose={onModalClose}>
				<div>other modal content</div>
				<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
			</CustomModal>
		);

		await user.click(getCustomizeTrigger());
		await user.click(screen.getByText('other modal content'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
		expect(onModalClose).not.toHaveBeenCalled();
	});

	test('dragging the picker handle past the popover edge and releasing outside does not close it', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<>
				<div>outside content</div>
				<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
			</>
		);

		await user.click(getCustomizeTrigger());

		// Simulates a drag that starts on the picker (inside the popover) and ends outside it: the
		// native `click` this produces targets wherever the mouse was released, not where the drag
		// began, so it must be dispatched separately from the mousedown to reproduce that sequence.
		/* eslint-disable testing-library/prefer-user-event */
		fireEvent.mouseDown(getHexInput());
		fireEvent.click(screen.getByText('outside content'));
		/* eslint-enable testing-library/prefer-user-event */

		expect(onChange).not.toHaveBeenCalled();
		expect(getHexInput()).toBeVisible();
	});

	test('clicking the trigger again while open still toggles the popover closed', async () => {
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} />
		);

		const trigger = getCustomizeTrigger();
		await user.click(trigger);
		expect(getHexInput()).toBeVisible();

		await user.click(trigger);
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
	});

	test('notifies onOpenChange when the popover opens and closes', async () => {
		const onOpenChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker
				colors={COLORS}
				value={STANDARD_COLOR.hex}
				onChange={vi.fn()}
				onOpenChange={onOpenChange}
			/>
		);

		await user.click(getCustomizeTrigger());
		expect(onOpenChange).toHaveBeenLastCalledWith(true);

		await user.click(screen.getByText('Close'));
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
	});

	test('disables the standard dots and the trigger when disabled', () => {
		setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={vi.fn()} disabled />
		);

		expect(getStandardDot(STANDARD_COLOR.label)).toBeDisabled();
		expect(getCustomizeTrigger()).toBeDisabled();
	});

	test('re-selects the last picked custom color after switching to a standard color', async () => {
		const ControlledPicker: FC<Omit<ColorPickerProps, 'colors' | 'value' | 'onChange'>> = (
			props
		) => {
			const [value, setValue] = useState<string>(STANDARD_COLOR.hex);
			return <ColorPicker {...props} colors={COLORS} value={value} onChange={setValue} />;
		};

		const { user } = setupTest(<ControlledPicker />);

		// Pick a custom color via the popover, so `lastCustomHex` gets set.
		await user.click(getCustomizeTrigger());
		await user.clear(getHexInput());
		await user.type(getHexInput(), CUSTOM_HEX);
		await user.click(screen.getByText('Choose'));

		const customDot = screen.getByRole('button', { name: CUSTOM_COLOR_LABEL });
		expect(customDot).toHaveAttribute(ARIA_PRESSED, 'true');

		// Switch to a standard color: the custom dot stays visible, but becomes unselected.
		await user.click(getStandardDot(ANOTHER_STANDARD_COLOR.label));
		expect(customDot).toHaveAttribute(ARIA_PRESSED, 'false');

		// Clicking the custom dot again re-applies the original custom color.
		await user.click(customDot);
		expect(customDot).toHaveAttribute(ARIA_PRESSED, 'true');
	});

	test('renders the caption when provided', () => {
		setupTest(
			<ColorPicker
				colors={COLORS}
				value={STANDARD_COLOR.hex}
				onChange={vi.fn()}
				caption="Pick a color"
			/>
		);

		expect(screen.getByText('Pick a color')).toBeVisible();
	});

	test('re-selecting the custom dot while it is already applied keeps it selected', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={CUSTOM_HEX} onChange={onChange} />
		);

		await user.click(screen.getByRole('button', { name: CUSTOM_COLOR_LABEL }));

		expect(onChange).toHaveBeenCalledWith(CUSTOM_HEX);
	});

	test('disables every dot while the popover is open, but not the trigger', async () => {
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={CUSTOM_HEX} onChange={vi.fn()} />
		);

		await user.click(getCustomizeTrigger());

		expect(getStandardDot(STANDARD_COLOR.label)).toBeDisabled();
		expect(screen.getByRole('button', { name: CUSTOM_COLOR_LABEL })).toBeDisabled();
		expect(getCustomizeTrigger()).toBeEnabled();
	});

	test('moving the hue slider updates the hex input and the saved draft', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());
		// react-colorful sliders are keyboard-operable: a key press fires the same onChange as a drag.
		// eslint-disable-next-line testing-library/prefer-user-event
		fireEvent.keyDown(screen.getByRole('slider', { name: 'Hue' }), {
			key: 'ArrowRight',
			keyCode: 39
		});

		const movedHex = (getHexInput() as HTMLInputElement).value;
		expect(movedHex).not.toBe(STANDARD_COLOR.hex);

		await user.click(screen.getByText('Choose'));
		expect(onChange).toHaveBeenCalledWith(movedHex);
	});

	test('pressing Escape closes the popover without calling onChange', async () => {
		const onChange = vi.fn();
		const { user } = setupTest(
			<ColorPicker colors={COLORS} value={STANDARD_COLOR.hex} onChange={onChange} />
		);

		await user.click(getCustomizeTrigger());
		await user.keyboard('{Escape}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox', { name: HEX_INPUT_LABEL })).not.toBeInTheDocument();
	});
});
