// eslint-disable-next-line no-shadow
export enum ResourceStatus {
	Available = 0,
	InUse = 1,
	NotAvailable = 2
}

export interface Resource {
	category: string;
	cost: number;
	description: string;
	id?: number;
	make: string;
	model: string;
	name: string;
	projectId: number;
	serialNr: string;
	startLat?: number;
	startLng?: number;
	stopLat?: number;
	stopLng?: number;
	type: number;
	typeName: string;
	year: number;
	status: ResourceStatus;
}

export interface ResourceCategory {
	id: number;
	name: string;
}

export interface ResourceType {
	type: number;
	name: string;
	category: number;
	categoryName: string;
}
