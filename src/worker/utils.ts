/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 *
 * @param link
 */
export const getLinkIdMapKey = (link: { rid?: string; zid?: string }): string | null => {
	if (!link) {
		return null;
	}

	if (!link.rid || !link.zid) {
		return null;
	}

	return `${link.zid}:${link.rid}`;
};
