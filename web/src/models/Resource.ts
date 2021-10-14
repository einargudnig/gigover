export interface Resource {
	category: string;
	cost: number;
	description: string;
	id: number;
	make: string;
	model: string;
	name: string;
	projectId: number;
	serialNr: string;
	startLat: number;
	startLng: number;
	stopLat: number;
	stopLng: number;
	type: number;
	typeName: string;
	year: number;
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
