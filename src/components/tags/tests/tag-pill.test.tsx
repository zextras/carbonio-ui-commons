/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen, setupTest } from '../../../__test__/test-setup';
import { IconTagPill, TagIcon, TagPill } from '../tag-pill';

const RED = '#ef5350';
const ICON_PILL = 'icon-tag-pill';
const REMOVE_URGENT = 'Remove tag Urgent';

/** The rules inside media queries that apply to `element`: jsdom matches no media query. */
const mediaRulesOf = (element: Element): Array<{ condition: string; rule: CSSStyleRule }> =>
	Array.from(document.styleSheets)
		.flatMap((sheet) => Array.from(sheet.cssRules))
		.filter((rule): rule is CSSMediaRule => rule instanceof CSSMediaRule)
		.flatMap((media) =>
			(Array.from(media.cssRules) as Array<CSSStyleRule>)
				.filter((rule) => element.matches(rule.selectorText))
				.map((rule) => ({ condition: media.conditionText, rule }))
		);

describe('TagPill', () => {
	test('shows the name on a tint of the tag colour, with a 12px tag icon of the colour', () => {
		setupTest(<TagPill name="Client" color="#2b73d2" />);

		expect(screen.getByText('Client')).toBeVisible();
		expect(screen.getByTestId('tag-pill')).toHaveStyle({
			'background-color': 'rgba(43, 115, 210, 0.14)'
		});
		expect(screen.queryByTestId('tag-dot')).not.toBeInTheDocument();
		expect(screen.getByTestId('icon: Tag')).toHaveStyle({
			color: '#2b73d2',
			width: '0.75rem',
			height: '0.75rem'
		});
	});

	test('a near-white colour gets a border', () => {
		setupTest(<TagPill name="Later" color="#fffde7" />);

		expect(screen.getByTestId('tag-pill')).toHaveStyle({ border: '1px solid #c9ced6' });
	});

	test('is not a button when it has no action', () => {
		setupTest(<TagPill name="Client" color="#2b73d2" />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	test('is a button named after the tag when clickable', async () => {
		const onClick = vi.fn();
		const { user } = setupTest(<TagPill name="Client" color="#2b73d2" onClick={onClick} />);

		await user.click(screen.getByRole('button', { name: 'Client' }));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test('a removable pill has a second button that removes the tag, not a click on the pill', async () => {
		const onClick = vi.fn();
		const onRemove = vi.fn();
		const { user } = setupTest(
			<TagPill name="Urgent" color={RED} onClick={onClick} onRemove={onRemove} />
		);

		await user.click(screen.getByRole('button', { name: REMOVE_URGENT }));

		expect(onRemove).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
	});

	test('the pill and its remove button are both in the Tab order, pill first', async () => {
		const { user } = setupTest(
			<TagPill name="Urgent" color={RED} onClick={vi.fn()} onRemove={vi.fn()} />
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Urgent' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: REMOVE_URGENT })).toHaveFocus();
	});

	test('the caller can name the remove button, e.g. for a whole conversation', () => {
		setupTest(
			<TagPill
				name="Urgent"
				color={RED}
				onRemove={vi.fn()}
				removeLabel="Remove tag Urgent from conversation"
			/>
		);

		expect(
			screen.getByRole('button', { name: 'Remove tag Urgent from conversation' })
		).toBeInTheDocument();
	});

	test('at rest the hidden "×" takes nothing from the right padding of the name', () => {
		setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		const slot = screen.getByRole('button', { name: REMOVE_URGENT }).parentElement;
		expect(slot).toHaveStyle({ width: '0px' });
		expect(slot).not.toHaveStyle({ 'margin-left': '-0.375rem' });
	});

	test('with reduced motion the hidden "×" keeps its width but takes no clicks', () => {
		setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		const slot = screen.getByRole('button', { name: REMOVE_URGENT }).parentElement as HTMLElement;
		const noClicks = mediaRulesOf(slot).filter(
			({ rule }) => rule.style.getPropertyValue('pointer-events') === 'none'
		);
		expect(noClicks.map(({ condition }) => condition)).toEqual([
			expect.stringContaining('prefers-reduced-motion: reduce')
		]);
	});

	test('on a touch screen with reduced motion the "×", shown at rest, takes the first tap', () => {
		setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		const slot = screen.getByRole('button', { name: REMOVE_URGENT }).parentElement as HTMLElement;
		const noClicks = mediaRulesOf(slot).filter(
			({ rule }) => rule.style.getPropertyValue('pointer-events') === 'none'
		);
		expect(noClicks.map(({ condition }) => condition)).toEqual([
			expect.stringContaining('hover: hover')
		]);
	});

	test('on the way out the slot gives back its overlap with its width, so the pill never widens', () => {
		setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		const slot = screen.getByRole('button', { name: REMOVE_URGENT }).parentElement;
		expect(slot).toHaveStyle({
			transition: 'opacity 60ms ease-in,width 120ms ease-in 60ms,margin-left 120ms ease-in 60ms'
		});
	});

	test('at rest the hidden "×" is scaled to 0.6, so it grows as it fades in', () => {
		setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		expect(screen.getByRole('button', { name: REMOVE_URGENT })).toHaveStyle({
			transform: 'translateY(-50%) scale(0.6)'
		});
	});

	test('the remove button has the tooltip "Remove tag"', async () => {
		const { user } = setupTest(<TagPill name="Urgent" color={RED} onRemove={vi.fn()} />);

		await user.hover(screen.getByRole('button', { name: REMOVE_URGENT }));

		expect(await screen.findByText('Remove tag')).toBeVisible();
	});

	describe('a tag from a folder shared by someone else', () => {
		test('is outlined, with the shared icon and no colour', () => {
			setupTest(<TagPill name="Finance" shared tooltip="Tag from a folder shared by m@x.com" />);

			expect(screen.getByText('Finance')).toBeVisible();
			expect(screen.getByTestId('icon: PeopleOutline')).toBeVisible();
			expect(screen.queryByTestId('icon: Tag')).not.toBeInTheDocument();
			expect(screen.getByTestId('tag-pill')).toHaveStyle({
				'background-color': 'rgba(0, 0, 0, 0)',
				border: '1px solid #767676'
			});
		});

		test('can be neither clicked nor removed', () => {
			setupTest(<TagPill name="Finance" shared onClick={vi.fn()} onRemove={vi.fn()} />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		test('says whose folder it comes from on hover', async () => {
			const { user } = setupTest(
				<TagPill name="Finance" shared tooltip="Tag from a folder shared by m@x.com" />
			);

			await user.hover(screen.getByText('Finance'));

			expect(await screen.findByText('Tag from a folder shared by m@x.com')).toBeVisible();
		});
	});
});

/** The CSS rules that apply to the path of `icon`, outline included. */
const pathRulesOf = (icon: Element): Array<CSSStyleRule> => {
	const path = icon.querySelector('path');
	return Array.from(document.styleSheets)
		.flatMap((sheet) => Array.from(sheet.cssRules))
		.filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
		.filter((rule) => path !== null && path.matches(rule.selectorText));
};

describe('TagIcon', () => {
	test('is the tag icon in the exact tag colour, outlined in grey', () => {
		setupTest(<TagIcon color="#ffc107" />);

		const icon = screen.getByTestId('icon: Tag');
		expect(icon).toHaveStyle({ color: '#ffc107', width: '0.75rem' });
		const outline = pathRulesOf(icon).find((rule) => rule.style.getPropertyValue('stroke'))?.style;
		expect(outline?.getPropertyValue('stroke')).toBe('#767676');
		// centre-aligned, the same width however the icon is scaled
		expect(outline?.getPropertyValue('stroke-width')).toBe('0.5px');
		expect(outline?.getPropertyValue('vector-effect')).toBe('non-scaling-stroke');
	});

	test('at 16px, in menus, the outline is 0.75px', () => {
		setupTest(<TagIcon color="#ffc107" size="medium" />);

		const icon = screen.getByTestId('icon: Tag');
		expect(icon).toHaveStyle({ width: '1rem' });
		const outline = pathRulesOf(icon).find((rule) => rule.style.getPropertyValue('stroke'))?.style;
		expect(outline?.getPropertyValue('stroke-width')).toBe('0.75px');
	});
});

describe('IconTagPill', () => {
	test('is a round 20px pill with the tag icon on the tint, without the name', () => {
		setupTest(<IconTagPill name="Client" color="#2b73d2" />);

		expect(screen.getByTestId(ICON_PILL)).toHaveStyle({
			width: '1.25rem',
			height: '1.25rem',
			'border-radius': '50%',
			'background-color': 'rgba(43, 115, 210, 0.14)'
		});
		expect(screen.getByTestId('icon: Tag')).toBeVisible();
		expect(screen.queryByText('Client')).not.toBeInTheDocument();
	});

	test('shows the name of the tag on hover', async () => {
		const { user } = setupTest(<IconTagPill name="Client" color="#2b73d2" />);

		await user.hover(screen.getByTestId(ICON_PILL));

		expect(await screen.findByText('Client')).toBeVisible();
	});

	test('is not a Tab stop', async () => {
		const { user } = setupTest(<IconTagPill name="Client" color="#2b73d2" />);

		await user.tab();

		expect(document.body).toHaveFocus();
	});

	test('a near-white colour gets the same border as a pill', () => {
		setupTest(<IconTagPill name="Later" color="#fffde7" />);

		expect(screen.getByTestId(ICON_PILL)).toHaveStyle({ border: '1px solid #c9ced6' });
	});

	test('a tag from a shared folder keeps the shared icon and the outline, and its tooltip', async () => {
		const { user } = setupTest(
			<IconTagPill name="Finance" shared tooltip="Finance (from m@x.com's folder)" />
		);

		expect(screen.getByTestId('icon: PeopleOutline')).toBeVisible();
		expect(screen.getByTestId(ICON_PILL)).toHaveStyle({ border: '1px solid #767676' });
		await user.hover(screen.getByTestId(ICON_PILL));
		expect(await screen.findByText("Finance (from m@x.com's folder)")).toBeVisible();
	});
});
