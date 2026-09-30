/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { resolveFolderColorHex } from '../components/select/folders/utils';
import type { Tag } from '../types/tags';

/**
 * Resolves a tag's color into a single hex string: an `rgb` custom color takes precedence,
 * otherwise the standard color at `color` index. Tags share the standard folder palette.
 */
export const resolveTagColorHex = (
	tag: { color?: Tag['color'] | string; rgb?: Tag['rgb'] } | undefined
): string => resolveFolderColorHex(tag?.color, tag?.rgb);
