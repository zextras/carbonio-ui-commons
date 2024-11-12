/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';

import {
	Breadcrumbs,
	BreadcrumbsProps,
	Container,
	Row,
	Text,
	TextProps,
	Tooltip
} from '@zextras/carbonio-design-system';

type StaticBreadcrumbsProps = BreadcrumbsProps & {
	size?: TextProps['size'];
	tooltipLabel?: string;
};

const StaticBreadcrumbs: FC<StaticBreadcrumbsProps> = ({
	crumbs,
	size = 'large',
	tooltipLabel
}) => {
	const crumbsCount = crumbs.length;
	const tooltip =
		tooltipLabel ?? crumbs.reduce<string>((result, crumb) => `${result}/${crumb.label}`, '');
	const firstCrumb = crumbs[0];
	const restCrumbs = crumbs.slice(1);

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
					<Breadcrumbs crumbs={restCrumbs} dropdownProps={{ disabled: true }}></Breadcrumbs>
				</Row>
			</Row>
		</Tooltip>
	);
};

export { StaticBreadcrumbsProps, StaticBreadcrumbs };
