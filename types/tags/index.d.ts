import { ComponentType, SyntheticEvent } from 'react';
import { ItemType } from '../../../types';

export type TagsAccordionItems = {
	items: ItemType[];
	id: string;
	label: string;
	active: false;
	open: boolean;
	onClick: (e: SyntheticEvent<Element, Event> | KeyboardEvent) => void;
	CustomComponent: ComponentType<any>;
};
