import { Project } from './Project';

export interface Tender {
	tenderId: number;
	projectId: number;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	status?: number;
	phoneNumber: string;
	offerNote?: string;
	projectName: Project[]; // I'm not sure if I should do this? I want to have the projectName on the tender object. This does work but it's kinda sloppy.
	items: TenderItem[];
}

// I really don't like that I'm adding the offers type to this.
// Even though in reality it's probably correct.
// I feel like it's kind of sloppy. Adding noise to the interface.
// But in the end it's probably the best way to do it. Since I'm still working with the 'same' tenderItem.
export interface TenderItem {
	tenderId: number;
	tenderItemId?: number;
	offerId?: number; // This comes from the Offer made by the tenderOwner?
	nr: number; //! I should make this optional, since the tenderOwner might want to leave it empty.
	description: string;
	volume: number;
	unit: string;
	cost?: number;
	notes?: string;
}

// To get the tender By Id, the 'definition' and the items
export interface GetTenderById {
	tender: Tender;
	// tenderItems: TenderItem[]; //! This one is not needed anymore, since the response has an items array on the tender object.
}

export interface Offer {
	offerId: number;
	tenderId: number;
	status: number;
	statusText: string;
	notes?: string;
}
