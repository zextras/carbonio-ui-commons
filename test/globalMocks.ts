/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as hooks from '../store/zustand/folder/hooks';

import { generateFolders } from './mocks/folders/folders-generator';
import { generateRoots } from './mocks/folders/roots-generator';

const mockedRoots = generateRoots();
const mockedFolders = generateFolders();

jest.spyOn(hooks, 'useFolder').mockImplementation((id: string) => mockedFolders[id]);
jest.spyOn(hooks, 'getFolder').mockImplementation((id: string) => mockedFolders[id]);
jest.spyOn(hooks, 'useFolders').mockImplementation(() => mockedFolders);
jest.spyOn(hooks, 'getFolders').mockImplementation(() => mockedFolders);
jest.spyOn(hooks, 'useRoot').mockImplementation((id: string) => mockedRoots[id]);
jest.spyOn(hooks, 'getRoot').mockImplementation((id: string) => mockedRoots[id]);
jest.spyOn(hooks, 'useRoots').mockImplementation(() => mockedRoots);
jest.spyOn(hooks, 'getRoots').mockImplementation(() => mockedRoots);
