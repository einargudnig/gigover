export interface IProperty {
	propertyId: number;
	name: string;
	address: string;
	city: string;
	contact: string;
	phoneNumber: string;
	email: string;
	occupation: string;
}

export interface IPropertyForm {
	propertyId: number;
	name: string;
	address: string;
	zip: string;
	city: string;
	country: string;
	size: string;
	type: string;
}

export interface IPropertyUnit {
	unitId: number;
	propertyId: number;
	name: string;
	size: string;
	type: string;
}

export interface IStakeholder {
	id: number;
	name: string;
	phoneNumber: string;
	email: string;
	role: string;
}
