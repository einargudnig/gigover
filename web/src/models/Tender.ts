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
	bidStatus?: number;
	email: string;
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
	tenderId: number;
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
	// tenderOwenerEmail: string; //! I should add this
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
	documents: TenderDocument[];
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
	status: number;
	offerCount: number;
}

// ! This is for the client-bids
// For increased context -> It's possible to send this straight without the Tender phase.
// I will keep this in Tender context for now, since it's linked together in the app
// Maybe I'll move it later...
export interface Bid {
	bidId?: number;
	description: string;
	terms: string;
	address: string;
	delivery: number; // 1 is delivery, 0 is pickup
	finishDate: number; // Timestamp -> 'Bid valid through'
	status?: number; // 0 = unpublished, 1 = published, 2 = accepted, 3 = rejected
	clientUId: string;
	clientEmail?: string;
	notes?: string;
	items?: BidItem[];
}

export interface BidItem {
	bidId: number;
	bidItemId?: number;
	nr?: string;
	description?: string;
	volume?: number;
	unit?: string;
	cost?: number;
}

export interface BidId {
	bidId: number;
}
