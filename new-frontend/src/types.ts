export enum PageId {
	Frontpage = 'Frontpage',
	Pricing = 'Pricing',
	Help = 'Help',
	MobileApp = 'MobileApp',
	Features = 'Features',
	Learn = 'Learn',
	About = 'About',
	Blog = 'Blog'
}

export type PricePlanField = {
	fieldKey: string;
	fieldValue: string;
};

export type PricePlan = {
	name: string;
	description: string;
	monthlyPrice: number;
	pricePlanFields: PricePlanField[];
};

export type Page = {
	id: string;
	name: string;
	slug: string;
	inNavigation: boolean;
	pageId: PageId;
	pricePlans: PricePlan[];
};

import { ColorKey } from './theme';

export enum PageBlockType {
	Hero = 'Hero',
	Video = 'Video',
	Features = 'Features',
	Reviews = 'Reviews',
	Testimonial = 'Testimonial',
	Image = 'Image'
}

export type Feature = {
	title: string;
	description: string;
	icon: 'report' | 'timer' | 'message' | 'tasks';
};

export type Testimonial = {
	testimonial: string;
	name: string;
	company: string;
	image: Asset | null;
};

export interface PageBlock {
	id: string;
	heading: string | null;
	content: string | null;
	image: Asset | null;
	pageBlockColor: ColorKey;
	blockType: PageBlockType;
	features: Feature[];
	testimonials: Testimonial[];
}

export type Asset = {
	id: string;
	handle: string;
	fileName: string;
	width: number;
	height: number;
	url: string;
};
