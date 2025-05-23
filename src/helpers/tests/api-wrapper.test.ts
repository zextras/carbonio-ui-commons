/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { HttpResponse } from 'msw';

import { createAPIInterceptor } from '../../__test__/mocks/network/msw/create-api-interceptor';
import { apiWrapper } from '../api-wrapper';

describe('Api Wrapper', () => {
	beforeEach(() => {
		createAPIInterceptor('post', '/myApi', HttpResponse.json({ data: 'success' }, { status: 200 }));
		createAPIInterceptor('post', '/myApiEmptyBody', new HttpResponse(null, { status: 200 }));
		createAPIInterceptor('post', '/myApi207', new HttpResponse(null, { status: 207 }));
		createAPIInterceptor(
			'post',
			'/myApiError',
			HttpResponse.json({}, { type: 'error', status: 500, statusText: 'Failed' })
		);
	});

	it('should return body when present', async () => {
		const expectedBody = { data: 'success' };

		const response = await apiWrapper<string, string>(
			fetch(`/myApi`, {
				method: 'POST',
				body: JSON.stringify({ data: 'test' })
			})
		);
		if ('error' in response) {
			throw new Error('Api returned error but none expected');
		}

		expect(response.data).toEqual(expectedBody);
	});

	it('should return response with empty data when no body in response', async () => {
		const response = await apiWrapper<string, string>(
			fetch(`/myApiEmptyBody`, {
				method: 'POST'
			})
		);
		if ('error' in response) {
			throw new Error('Api returned error but none expected');
		}

		expect(response.data).toEqual({});
	});

	it('should return error when not 2XX', async () => {
		const response = await apiWrapper<string, string>(
			fetch(`/myApiError`, {
				method: 'POST'
			})
		);
		expect(response).toHaveProperty('error');
	});

	it('should not fail with 207', async () => {
		const response = await apiWrapper<string, string>(
			fetch(`/myApi207`, {
				method: 'POST'
			})
		);
		expect(response).toHaveProperty('data');
	});
});
