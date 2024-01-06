export interface IProperties {
	propertyId: number;
	name: string;
	address: string;
	city: string;
	zipCode: string;
	country: string;
	size: string;
	type: string;
}

export interface IProperty {
	propertyId: number;
	name: string;
	address: string;
	city: string;
	zipCode: string;
	country: string;
	size: string;
	type: string;
	units: IPropertyUnit[];
	stakeHolders: IStakeholder[];
	projects: ProjectOnProperty[];
}

export interface IPropertyForm {
	propertyId: number;
	name: string;
	address: string;
	zipCode: string;
	city: string;
	country: string;
	size: string;
	type: string;
}

export interface IPropertyUnit {
	name: string;
	size: string;
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
