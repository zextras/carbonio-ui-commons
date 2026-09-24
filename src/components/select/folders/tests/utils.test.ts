/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { generateFolder } from '../../../../__test__/mocks/folders/folders-generator';
import { ZIMBRA_STANDARD_COLORS } from '../../../../constants/utils';
import { Folder } from '../../../../types';
import {
	flattenAndFilterFoldersWithCap,
	getFolderIconColor,
	resolveFolderColorHex
} from '../utils';

function generateFolderFunction(name: string, n: number, depth: number): Folder {
	if (depth >= 3) {
		return generateFolder({ name, children: [] });
	}

	const children = Array.from({ length: n }, (_, i) =>
		generateFolderFunction(`Subfolder ${name}-${i + 1}`, n, depth + 1)
	);

	return generateFolder({ name, children });
}

function generateLargeFolderStructure(n: number): Folder[] {
	return Array.from({ length: n }, (_, i) => generateFolderFunction(`Folder ${i + 1}`, n, 0));
}

const folder1 = generateFolder({ name: 'folder1' });
const folder2 = generateFolder({ name: 'folder2' });
const folder3 = generateFolder({ name: 'folder3' });
const mockFolders: Folder[] = [
	generateFolder({
		name: 'inbox',
		children: [folder1, folder2, folder3]
	}),
	generateFolder({
		name: 'sent',
		children: [folder1]
	})
];

describe('flattenAndFilterFoldersWithCap', () => {
	const largeFolderStructure: Folder[] = generateLargeFolderStructure(10);

	it('should run within acceptable time limits', () => {
		const searchTerm = 'test';
		const startTime = performance.now();
		const result = flattenAndFilterFoldersWithCap(largeFolderStructure, searchTerm, 100);
		const endTime = performance.now();
		const executionTime = endTime - startTime;

		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);

		expect(executionTime).toBeLessThan(100);
	});

	it('returns folders with exact name match', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'sent', 100);
		expect(result).toEqual([{ ...mockFolders[1], children: [] }]);
	});

	it('returns folders with partial name match', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'old', 100);
		expect(result).toEqual([folder1, folder2, folder3, folder1]);
	});

	it('performs case-insensitive matching', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'fOldeR1', 100);
		expect(result).toEqual([folder1, folder1]);
	});

	it('returns empty array when no matches are found', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'nonexistent', 100);
		expect(result).toEqual([]);
	});
	it('limits the number of returned results according to the limit', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'fol', 2);
		expect(result.length).toBe(2);
	});
	it('does not mutate original folder structure', () => {
		const deepCopy = JSON.parse(JSON.stringify(mockFolders));
		flattenAndFilterFoldersWithCap(mockFolders, 'sub', 10);
		expect(mockFolders).toEqual(deepCopy);
	});

	it('returns full results if limit is greater than matches', () => {
		const result = flattenAndFilterFoldersWithCap(mockFolders, 'fol', 100);
		expect(result.length).toBe(4);
	});
});

describe('resolveFolderColorHex', () => {
	it('returns the rgb custom color when present, even with a standard color index', () => {
		expect(resolveFolderColorHex(3, '#123456')).toBe('#123456');
	});

	it('returns the standard color at the given index when there is no rgb', () => {
		expect(resolveFolderColorHex(5, undefined)).toBe(ZIMBRA_STANDARD_COLORS[5].hex);
	});

	it('accepts the index as a string', () => {
		expect(resolveFolderColorHex('2', undefined)).toBe(ZIMBRA_STANDARD_COLORS[2].hex);
	});

	it('falls back to the first standard color when neither is set', () => {
		expect(resolveFolderColorHex(undefined, undefined)).toBe(ZIMBRA_STANDARD_COLORS[0].hex);
	});

	it('falls back to the first standard color for an out-of-palette index', () => {
		expect(resolveFolderColorHex(42, undefined)).toBe(ZIMBRA_STANDARD_COLORS[0].hex);
	});

	it('ignores an empty rgb', () => {
		expect(resolveFolderColorHex(1, '')).toBe(ZIMBRA_STANDARD_COLORS[1].hex);
	});
});

describe('getFolderIconColor', () => {
	it('prefers the folder rgb over its color index', () => {
		const folder = { ...generateFolder(), color: 1, rgb: '#abcdef' };
		expect(getFolderIconColor(folder)).toBe('#abcdef');
	});

	it('uses the rgb even when the color index is missing', () => {
		const folder = { ...generateFolder(), color: undefined, rgb: '#abcdef' };
		expect(getFolderIconColor(folder)).toBe('#abcdef');
	});

	it('uses the standard color when there is no rgb', () => {
		const folder = { ...generateFolder(), color: 4, rgb: undefined };
		expect(getFolderIconColor(folder)).toBe(ZIMBRA_STANDARD_COLORS[4].hex);
	});

	it('falls back to the first standard color for an accordion item without color', () => {
		expect(getFolderIconColor({ id: '1', label: 'item' })).toBe(ZIMBRA_STANDARD_COLORS[0].hex);
	});
});
