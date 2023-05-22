/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
	Breadcrumbs,
	BreadcrumbsProps,
	Container,
	Row,
	Text,
	TextProps,
	Tooltip
} from '@zextras/carbonio-design-system';
import React from 'react';

type StaticBreadcrumbsProps = BreadcrumbsProps & {
	size?: TextProps['size'];
	tooltipLabel?: string;
};

const StaticBreadcrumbs = React.forwardRef<HTMLDivElement, StaticBreadcrumbsProps>(
	function BreadcrumbsFn(
		{ crumbs, collapserProps, dropdownProps, size = 'large', tooltipLabel, ...rest },
		ref
	) {
		const crumbsCount = crumbs.length;
		const tooltip =
			tooltipLabel ?? crumbs.reduce<string>((result, crumb) => `${result}/${crumb.label}`, '');
		const firstCrumb = crumbs.shift();

		return (
			<Tooltip label={tooltip}>
				<Row mainAlignment="flex-start" wrap="nowrap" width="fill">
					<Container
						width="fit"
						mainAlignment="flex-start"
						padding={{ left: 'small', right: 'extrasmall' }}
					>
						<Text size={size} color={crumbsCount === 1 ? 'text' : 'secondary'}>
							{firstCrumb?.label ?? ''}
						</Text>
					</Container>
					{/* FIXME the width/maxWidth */}
					<Row mainAlignment="flex-start" maxWidth="70%">
						<Breadcrumbs crumbs={crumbs} dropdownProps={{ disabled: true }}></Breadcrumbs>
					</Row>
				</Row>
			</Tooltip>
		);
	}
);

export { StaticBreadcrumbsProps, StaticBreadcrumbs };
