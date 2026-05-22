/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Theme as DSTheme } from '@zextras/carbonio-design-system';

declare module '@emotion/react' {
	/**
	 * Augment Theme as suggested inside Emotion module
	 * @see https://emotion.sh/docs/typescript#define-a-theme
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Theme extends DSTheme {}
}
