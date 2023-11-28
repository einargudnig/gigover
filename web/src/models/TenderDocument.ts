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

export interface TenderDocumentByTenderOwner {
	id: number;
	tenderId: number;
	name: string;
	type: DocumentTypes;
	url: string;
	bytes: number;
	created: number; // Timestamp
}
