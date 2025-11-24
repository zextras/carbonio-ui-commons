/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import path from 'path';

export const folderWorker = new Worker(path.join(__dirname, './folder'));

export const tagsWorker = new Worker(path.join(__dirname, './tags'));
