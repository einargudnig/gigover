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
	phoneNumber: string;
	projectName: Project[]; // I'm not sure if I should do this? I want to have the projectName on the tender object. This does work but it's kinda sloppy.
	items: TenderItem[];
}

export interface TenderItem {
	tenderId: number;
	tenderItemId?: number;
	nr: number; //! I should make this optional, since the tenderOwner might want to leave it empty.
	description: string;
	volume: number;
	unit: string;
}

export interface TenderItemOffers {
	tenderId: number;
	tenderItemId?: number;
	offerId: number; // This comes from the Offer made by the tenderOwner?
	nr: number;
	description: string; //! This will not be needed? The user will not be able to change this. So can I omit it ??
	volume: number; //! This will not be needed? The user will not be able to change this. So can I omit it ??
	unit: string; //! This will not be needed? The user will not be able to change this. So can I omit it ??
	cost: number;
	notes: string;
}

// To get the tender By Id, the 'definition' and the items
export interface GetTenderById {
	tender: Tender;
	// tenderItems: TenderItem[]; //! This one is not needed anymore, since the response has an items array on the tender object.
}
