import { Stringifiable } from 'query-string';
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

export interface TenderItem {
	tenderId: number;
	tenderItemId?: number;
	nr?: number;
	description?: string;
	volume?: number;
	unit?: string;
	cost?: number;
	notes?: string;
}

// To get the tender By Id, the 'definition' and the items
export interface GetTenderById {
	tender: Tender;
}

export interface Offer {
	offerId: number;
	tenderId: number;
	status: number;
	statusText: string;
	notes?: string;
}

export interface GetOffer {
	email: string;
	items: GetOfferItem[];
	name: string;
	notes: string;
	offerId: number;
	status: number;
	statusText: string;
	tenderId: number;
	userName: string;
}

export interface GetOfferItem {
	cost: number;
	description: string;
	nr: 4;
	tenderItemId: number;
	unit: string;
	volume: number;
}

export interface OfferId {
	offerId: number;
}
