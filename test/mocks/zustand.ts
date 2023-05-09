/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { StateCreator, UseBoundStore, StoreApi } from 'zustand';

const { create: actualCreate } = jest.requireActual<typeof import('zustand')>('zustand');
import { act } from 'react-dom/test-utils';

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create =
	() =>
	<S>(createState: StateCreator<S>): UseBoundStore<StoreApi<S>> => {
		const store = actualCreate(createState);
		const initialState = store.getState();
		storeResetFns.add(() => store.setState(initialState, true));
		return store;
	};

// Reset all stores after each test run
beforeEach(() => {
	act(() => storeResetFns.forEach((resetFn) => resetFn()));
});
