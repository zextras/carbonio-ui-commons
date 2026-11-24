/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act } from '@testing-library/react';

import { screen, setupTest, within } from '../../../__test__/test-setup';
import { cardPosition } from '../hidden-tags-card-position';
import { HIDDEN_TAGS_CARD_DELAY_MS, ListTagPills, TagPillItem } from '../list-tag-pills';

const tag = (name: string, color = '#2b73d2'): TagPillItem => ({ id: name, name, color });

const CARD = 'hidden-tags-card';

const TAGS = [tag('Board'), tag('Client'), tag('Customer escalation', '#ef5350'), tag('Urgent')];

/** Lets the hover delay of the card run out. */
const openDelay = (ms = HIDDEN_TAGS_CARD_DELAY_MS): void => {
	act(() => {
		vi.advanceTimersByTime(ms);
	});
};

/** The pointer goes from `from` to `to`, as a browser reports it (React reads leave from mouseout). */
const pointerLeaves = (from: Element, to: Element): void => {
	act(() => {
		from.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: to }));
	});
};

describe('ListTagPills', () => {
	test('shows every tag as a pill on a wide line', () => {
		setupTest(<ListTagPills tags={TAGS.slice(0, 2)} lineWidth={2000} />);

		expect(screen.getAllByTestId('tag-pill')).toHaveLength(2);
		expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
	});

	test('shows "+N" as plain text, not a button, for the tags that do not fit', () => {
		setupTest(<ListTagPills tags={TAGS} lineWidth={300} />);

		const hidden = TAGS.length - screen.getAllByTestId('tag-pill').length;
		expect(hidden).toBeGreaterThan(0);
		expect(screen.getByText(`+${hidden}`)).toBeVisible();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	test('the first pill is always shown', () => {
		setupTest(
			<ListTagPills tags={[tag('A very long tag name that never fits')]} lineWidth={170} />
		);

		expect(screen.getByText('A very long tag name that never fits')).toBeInTheDocument();
	});

	test('on a line narrower than 160px shows at most two dots and "+N"', () => {
		setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		expect(screen.queryByTestId('tag-pill')).not.toBeInTheDocument();
		expect(screen.getAllByTestId('tag-dot')).toHaveLength(2);
		expect(screen.getByText('+2')).toBeVisible();
	});

	test('as a dot, a tag from a shared folder keeps the shared icon, as it has no colour', () => {
		setupTest(
			<ListTagPills
				tags={[tag('Client'), { id: 'nil:Finance', name: 'Finance', shared: true }]}
				lineWidth={150}
			/>
		);

		expect(screen.getAllByTestId('tag-dot')).toHaveLength(1);
		expect(screen.getByTestId('icon: PeopleOutline')).toBeVisible();
	});

	test('as a dot, a tag without a colour is an empty dot', () => {
		setupTest(<ListTagPills tags={[{ id: 'nocolour', name: 'No colour' }]} lineWidth={150} />);

		expect(screen.getByTestId('tag-dot')).toHaveStyle({ 'background-color': 'rgba(0, 0, 0, 0)' });
	});

	test('hovering "+N" opens a card with the hidden tags', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.hover(screen.getByText('+2'));
		openDelay();

		const card = screen.getByTestId(CARD);
		expect(within(card).getByText('2 more tags')).toBeVisible();
		expect(within(card).getByText('Customer escalation')).toBeVisible();
		expect(within(card).getByText('Urgent')).toBeVisible();
		expect(within(card).queryByText('Board')).not.toBeInTheDocument();
	});

	test('the card title is singular for one hidden tag', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS.slice(0, 3)} lineWidth={150} />);

		await user.hover(screen.getByText('+1'));
		openDelay();

		expect(screen.getByText('1 more tag')).toBeVisible();
	});

	test('the card title is dark enough to read at 12px (4.5:1 on white)', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS.slice(0, 3)} lineWidth={150} />);

		await user.hover(screen.getByText('+1'));
		openDelay();

		// secondary.active (#5c5c5c); secondary (#828282) is only 3.9:1
		expect(screen.getByText('1 more tag')).toHaveStyle({ color: '#5c5c5c' });
	});

	test('Esc closes the card', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.hover(screen.getByText('+2'));
		openDelay();
		screen.getByTestId(CARD);
		await user.keyboard('{Escape}');

		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();
	});

	test('the card opens only after the pointer rests on "+N" for 300ms', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.hover(screen.getByText('+2'));
		openDelay(HIDDEN_TAGS_CARD_DELAY_MS - 50);
		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();

		openDelay(50);
		expect(screen.getByTestId(CARD)).toBeVisible();
	});

	test('the pointer leaving "+N" closes the card, or keeps it from opening', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);
		const counter = screen.getByText('+2');

		await user.hover(counter);
		openDelay();
		await user.unhover(counter);
		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();

		await user.hover(counter);
		await user.unhover(counter);
		openDelay();
		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();
	});

	test('the card stays open while the pointer moves into it', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.hover(screen.getByText('+2'));
		openDelay();
		// user-event leaves relatedTarget unset; a browser sets it to where the pointer went
		pointerLeaves(screen.getByText('+2'), screen.getByTestId(CARD));

		expect(screen.getByTestId(CARD)).toBeVisible();

		pointerLeaves(screen.getByTestId(CARD), document.body);
		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();
	});

	test('opening the card leaves the focus where it is', async () => {
		const { user } = setupTest(
			<>
				<input aria-label="Search" />
				<ListTagPills tags={TAGS} lineWidth={150} />
			</>
		);
		const search = screen.getByRole('textbox', { name: 'Search' });
		await user.click(search);

		await user.hover(screen.getByText('+2'));
		openDelay();

		expect(screen.getByTestId(CARD)).toBeVisible();
		expect(search).toHaveFocus();
	});

	test('a scroll outside the card closes it, a scroll inside does not', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.hover(screen.getByText('+2'));
		openDelay();
		act(() => {
			screen.getByTestId(CARD).dispatchEvent(new Event('scroll'));
		});
		expect(screen.getByTestId(CARD)).toBeVisible();

		act(() => {
			document.dispatchEvent(new Event('scroll'));
		});
		expect(screen.queryByTestId(CARD)).not.toBeInTheDocument();
	});

	test('a shared pill and a near-white pill are wider than a plain one of the same name', () => {
		// 360px line: 144px of tags, room for exactly two plain pills named "Client" and "Shared"
		const { unmount } = setupTest(
			<ListTagPills tags={[tag('Client'), tag('Shared')]} lineWidth={360} />
		);
		expect(screen.getAllByTestId('tag-pill')).toHaveLength(2);
		unmount();

		const { unmount: unmountShared } = setupTest(
			<ListTagPills
				tags={[tag('Client'), { id: 'nil:Shared', name: 'Shared', shared: true }]}
				lineWidth={360}
			/>
		);
		expect(screen.getAllByTestId('tag-pill')).toHaveLength(1);
		unmountShared();

		setupTest(<ListTagPills tags={[tag('Client'), tag('Shared', '#ffffff')]} lineWidth={360} />);
		expect(screen.getAllByTestId('tag-pill')).toHaveLength(1);
	});

	test('"+N" is not a Tab stop', async () => {
		const { user } = setupTest(<ListTagPills tags={TAGS} lineWidth={150} />);

		await user.tab();

		expect(document.body).toHaveFocus();
	});
});

describe('cardPosition', () => {
	const anchor = (top: number, right: number): DOMRect =>
		({ top, bottom: top + 14, left: right - 18, right }) as DOMRect;

	beforeEach(() => {
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
	});

	test('below "+N" and right-aligned with it, no taller than the room below', () => {
		expect(cardPosition(anchor(100, 900))).toEqual({ left: 700, top: 118, maxHeight: 874 });
	});

	test('above "+N" when it is in the lower part of the window', () => {
		expect(cardPosition(anchor(900, 900))).toEqual({ left: 700, bottom: 104, maxHeight: 888 });
	});

	test('never past the left edge of the window', () => {
		expect(cardPosition(anchor(100, 50)).left).toBe(8);
	});
});
