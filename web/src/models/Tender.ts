export interface Tender {
	tenderId: number;
	projectId: number;
	projectName: string;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	status?: number;
	phoneNumber: string;
	offerNote?: string;
	items: TenderItem[];
	bidders: Bidder[];
	documents: TenderDocument[];
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

// needed for the document type
type DocumentTypeImage = 0 | 'IMAGE';
type DocumentTypeVideo = 1 | 'VIDEO';
type DocumentTypeDoc = 2 | 'DOCUMENT';

export type DocumentTypes = DocumentTypeImage | DocumentTypeVideo | DocumentTypeDoc;

export interface TenderDocument {
	id: number;
	offerId: number;
	name: string;
	type: DocumentTypes;
	url: string;
	bytes: number;
	created: number; // Timestamp
}

// To get the tender By Id, the 'definition' and the items
export interface GetTenderById {
	tender: Tender;
}

export interface Offer {
	email: string;
	name: string;
	tender: Tender;
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
	documents: OfferDocument[];
}

export interface GetOfferItem {
	cost: number;
	totalCost: number;
	productNumber: string;
	note: string;
	description: string;
	nr: number;
	tenderItemId: number;
	unit: string;
	volume: number;
}

export interface OfferId {
	offerId: number;
}

export interface Bidder {
	bidderId: number;
	userName: string;
	name: string;
	email: string;
}

export interface OfferDocument {
	id: number;
	offerId: number;
	name: string;
	type: DocumentTypes;
	url: string;
	bytes: number;
	created: number; // Timestamp
}
