export interface IProperties {
	propertyId: number;
	name: string;
	address: string;
	city: string;
	zipCode: string;
	country: string;
	size: number;
	type: string;
}

export interface IProperty {
	propertyId: number;
	name: string;
	address: string;
	city: string;
	zipCode: string;
	country: string;
	size: number;
	type: string;
	units: IPropertyUnit[];
	stakeHolders: IStakeholder[];
	projects: ProjectOnProperty[];
	documents: PropertyDocument[];
}

export interface IPropertyForm {
	propertyId: number;
	name: string;
	address: string;
	zipCode: string;
	city: string;
	country: string;
	size: number;
	type: string;
}

export interface IPropertyUnit {
	name: string;
	size: number;
	unitId: number;
	type: string;
	propertyId: number;
}

export interface IStakeholder {
	stakeHolderId: number;
	propertyId: number;
	unitId: number;
	uId: string;
	role: string;
	name: string;
	email: string;
	phoneNumber: string;
}

export interface PropertyToProject {
	propertyId: number;
	projectId: number;
}

export interface ProjectOnProperty {
	projectId: number;
	name: string;
	status: string;
	totalBytes: number;
	fileCount: number;
	owner: boolean;
}

// needed for the document type
type DocumentTypeImage = 0 | 'IMAGE';
type DocumentTypeVideo = 1 | 'VIDEO';
type DocumentTypeDoc = 2 | 'DOCUMENT';

export type DocumentTypes = DocumentTypeImage | DocumentTypeVideo | DocumentTypeDoc;

export interface PropertyDocument {
	id: number;
	propertyId: number;
	name: string;
	type: DocumentTypes;
	url: string;
	bytes: number;
	created: number; // Timestamp
}
