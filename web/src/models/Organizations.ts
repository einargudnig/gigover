export interface Organization {
	id: number;
	name: string;
	priv: 'A' | 'V' | 'E';
}

export interface OrganizationId {
	id: number;
}

export interface OrganizationInvites {
	uid: string;
	name: string;
	email: string;
	priv: string;
}
