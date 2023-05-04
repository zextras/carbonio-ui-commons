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
jest.spyOn(hooks, 'useRoot').mockImplementation((id: string) => mockedRoots[id]);
jest.spyOn(hooks, 'getRootsArray').mockImplementation(() => [...Object.values(mockedRoots)]);
jest.spyOn(hooks, 'getRootsMap').mockImplementation(() => mockedRoots);
