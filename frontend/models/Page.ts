export enum PageId {
	Frontpage = 'Frontpage',
	Pricing = 'Pricing',
	Help = 'Help',
	MobileApp = 'MobileApp',
	Features = 'Features',
	Learn = 'Learn'
}

export type Page = {
	id: string;
	name: string;
	slug: string;
	inNavigation: boolean;
	pageId: PageId;
};
