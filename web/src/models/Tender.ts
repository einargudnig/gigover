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

// ! This is for the create-bid
// i will keep this in Tender context for now, since it's linked together in the app
// Maybe I'll move it later...
export interface Bid {
	bidId: number;
	description: string;
	address: string;
	delivery: number; // 1 - 0 1 is delivery, 0 is pickup
	finishDate: number; // Timestamp -> 'Bid valid through'
	bidder: BidBidder;
	client: BidClient;
}

// This is a weird name?
//!  to differentiate between the bidder in the tender and the bidder in the bid
export interface BidBidder {
	bidderId: number;
	name: string;
	email: string;
	company: string;
	address: string;
	phoneNumber: string;
	companyId: number;
}

// This the client in the bid portion, not the tender (bidder + tender owner)
export interface BidClient {
	clientId: number;
	clientNumber: string;
	address: string;
	phoneNumber: string;
	email: string;
	other: string;
}
