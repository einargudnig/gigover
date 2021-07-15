export enum PageId {
	Frontpage = 'Frontpage',
	Pricing = 'Pricing',
	Help = 'Help',
	MobileApp = 'MobileApp',
	Features = 'Features',
	Learn = 'Learn',
	About = 'About',
	Blog = 'Blog',
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
