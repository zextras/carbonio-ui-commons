/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { isInaccessible } from '@testing-library/react';

import { screen, setupTest } from '../../../__test__/test-setup';
import { ListTagPills, TagPillItem } from '../list-tag-pills';

const PILL = 'tag-pill';
const ICON_PILL = 'icon-tag-pill';

const tag = (name: string, color = '#2b73d2'): TagPillItem => ({ id: name, name, color });

const TAGS = [tag('Board'), tag('Client'), tag('Customer escalation', '#ef5350'), tag('Urgent')];

/** Six short tags: on a wide line two pills, two icon-only pills and "+2". */
const SIX = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff'].map((name) => tag(`${name}${name}`));

const names = (hidden: ReadonlyArray<TagPillItem>): string =>
	hidden.map((item) => item.name).join(',');

describe('ListTagPills', () => {
	test('shows every tag as a pill on a wide line', () => {
		setupTest(<ListTagPills tags={TAGS.slice(0, 2)} lineWidth={2000} />);

		expect(screen.getAllByTestId(PILL)).toHaveLength(2);
		expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
	});

	test('the pills have the tag icon, not a dot', () => {
		setupTest(<ListTagPills tags={TAGS.slice(0, 2)} lineWidth={2000} />);

		expect(screen.getAllByTestId('icon: Tag')).toHaveLength(2);
		expect(screen.queryByTestId('tag-dot')).not.toBeInTheDocument();
	});

	test('the tags that do not fit as pills become icon-only pills, then "+N"', () => {
		setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		expect(screen.getAllByTestId(PILL)).toHaveLength(2);
		expect(screen.getAllByTestId(ICON_PILL)).toHaveLength(2);
		expect(screen.getByText('+2')).toBeVisible();
	});

	test('"+N" is plain text by default, not a button', () => {
		setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	test('an icon-only pill shows the name of its tag on hover', async () => {
		const { user } = setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		await user.hover(screen.getAllByTestId(ICON_PILL)[0]);

		expect(await screen.findByText('CcCc')).toBeVisible();
	});

	test('keeps 4px between the tags', () => {
		setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		expect(screen.getByTestId('list-tag-pills')).toHaveStyle({ gap: '0.25rem' });
	});

	test('the first pill is always shown', () => {
		setupTest(
			<ListTagPills tags={[tag('A very long tag name that never fits')]} lineWidth={170} />
		);

		expect(screen.getByText('A very long tag name that never fits')).toBeInTheDocument();
	});

	test('on a line narrower than 160px shows only icon-only pills and "+N"', () => {
		setupTest(<ListTagPills tags={TAGS.slice(0, 2)} lineWidth={150} />);

		expect(screen.queryByTestId(PILL)).not.toBeInTheDocument();
		expect(screen.getAllByTestId(ICON_PILL)).toHaveLength(2);
	});

	test('a near-white or shared last pill counts its border, and is truncated instead', () => {
		// 370px line, 148px of tags: two plain pills named "Client" and "Shared" fill it exactly
		const { unmount } = setupTest(
			<ListTagPills tags={[tag('Client'), tag('Shared')]} lineWidth={370} />
		);
		expect(screen.getAllByTestId(PILL)[1]).toHaveStyle({ 'max-width': 'none' });
		unmount();

		const { unmount: unmountShared } = setupTest(
			<ListTagPills
				tags={[tag('Client'), { id: 'nil:Shared', name: 'Shared', shared: true }]}
				lineWidth={370}
			/>
		);
		expect(screen.getAllByTestId(PILL)[1]).not.toHaveStyle({ 'max-width': 'none' });
		unmountShared();

		setupTest(<ListTagPills tags={[tag('Client'), tag('Shared', '#ffffff')]} lineWidth={370} />);
		expect(screen.getAllByTestId(PILL)[1]).not.toHaveStyle({ 'max-width': 'none' });
	});

	test('the pills are hidden from screen readers: the row lists every tag by name', () => {
		setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		expect(isInaccessible(screen.getAllByTestId(PILL)[0])).toBe(true);
		expect(isInaccessible(screen.getAllByTestId(ICON_PILL)[0])).toBe(true);
	});

	test('nothing is a Tab stop by default', async () => {
		const { user } = setupTest(<ListTagPills tags={SIX} lineWidth={2000} />);

		await user.tab();

		expect(document.body).toHaveFocus();
	});

	describe('with renderMore', () => {
		test('renders it in place of "+N", with the hidden tags, outside what is hidden from screen readers', () => {
			setupTest(
				<ListTagPills
					tags={SIX}
					lineWidth={2000}
					renderMore={(hidden): React.JSX.Element => (
						<button type="button">{`Show ${names(hidden)}`}</button>
					)}
				/>
			);

			const more = screen.getByRole('button', { name: 'Show EeEe,FfFf' });
			expect(isInaccessible(more)).toBe(false);
			expect(screen.queryByText('+2')).not.toBeInTheDocument();
		});

		test('is not called when every tag fits', () => {
			const renderMore = vi.fn(() => <span>more</span>);
			setupTest(<ListTagPills tags={TAGS.slice(0, 2)} lineWidth={2000} renderMore={renderMore} />);

			expect(renderMore).not.toHaveBeenCalled();
		});
	});

	describe('frozen, while the hidden tags are open', () => {
		const renderMore = (hidden: ReadonlyArray<TagPillItem>): React.JSX.Element => (
			<span data-testid="more">{names(hidden)}</span>
		);

		test('keeps the tags shown and their kind, whatever the width of the line', () => {
			const { rerender } = setupTest(
				<ListTagPills tags={SIX} lineWidth={2000} renderMore={renderMore} />
			);

			rerender(<ListTagPills tags={SIX} lineWidth={150} renderMore={renderMore} frozen />);

			expect(screen.getAllByTestId(PILL)).toHaveLength(2);
			expect(screen.getAllByTestId(ICON_PILL)).toHaveLength(2);
			expect(screen.getByTestId('more')).toHaveTextContent('EeEe,FfFf');
		});

		test('a removed hidden tag leaves the hidden ones, the shown ones do not move', () => {
			const { rerender } = setupTest(
				<ListTagPills tags={SIX} lineWidth={2000} renderMore={renderMore} />
			);

			rerender(
				<ListTagPills
					tags={SIX.filter((item) => item.name !== 'EeEe')}
					lineWidth={2000}
					renderMore={renderMore}
					frozen
				/>
			);

			expect(screen.getAllByTestId(ICON_PILL)).toHaveLength(2);
			expect(screen.getByTestId('more')).toHaveTextContent(/^FfFf$/);
		});

		test('when the last hidden tag is removed, renderMore is called with none, to close what it opened', () => {
			const renderMoreSpy = vi.fn(renderMore);
			const { rerender } = setupTest(
				<ListTagPills tags={SIX} lineWidth={2000} renderMore={renderMoreSpy} />
			);

			rerender(
				<ListTagPills tags={SIX.slice(0, 4)} lineWidth={2000} renderMore={renderMoreSpy} frozen />
			);

			expect(renderMoreSpy).toHaveBeenLastCalledWith([]);
		});

		test('recalculates when no longer frozen', () => {
			const { rerender } = setupTest(
				<ListTagPills tags={SIX} lineWidth={2000} renderMore={renderMore} />
			);
			const five = SIX.filter((item) => item.name !== 'EeEe');
			rerender(<ListTagPills tags={five} lineWidth={2000} renderMore={renderMore} frozen />);

			rerender(<ListTagPills tags={five} lineWidth={2000} renderMore={renderMore} />);

			// the last tag now fits as a third icon: "+N" goes
			expect(screen.getAllByTestId(ICON_PILL)).toHaveLength(3);
			expect(screen.queryByTestId('more')).not.toBeInTheDocument();
		});
	});
});
