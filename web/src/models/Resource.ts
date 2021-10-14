export interface Resource {
	name: string;
	description: string;
	type: number;
	make: string;
	model: string;
	year: number;
	serialNr: string;
	cost: number;
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
