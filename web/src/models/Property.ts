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
	uId: number;
	name: string;
	phoneNumber: string;
	email: string;
	role: string;
	propertyId: number;
	unitId: number;
}
