/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { generateFolders } from './folders-generator';
import { generateRoots } from './roots-generator';

const mockedRoots = generateRoots();
const mockedFolders = generateFolders();

export const useFolder = jest.fn((id: string) => mockedFolders[id]);
export const getFolder = jest.fn((id: string) => mockedFolders[id]);
export const useFolders = jest.fn(() => mockedFolders);
export const getFolders = jest.fn(() => mockedFolders);
export const useRoot = jest.fn((id: string) => mockedRoots[id]);
export const getRoot = jest.fn((id: string) => mockedRoots[id]);
export const useRoots = jest.fn(() => mockedRoots);
export const getRoots = jest.fn(() => mockedRoots);
