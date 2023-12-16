export interface IProperty {
	id: number;
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
